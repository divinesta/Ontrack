# OnTrack API Implementation Plan

This plan is the working backend roadmap for `apps/api`. It is based on the project decisions in `../../docs/`, especially `docs/CONTEXT.md`, `docs/architecture/*`, and `docs/engineering/*`.

Important decision update: the API plan now uses **hard delete** for user deletion actions. This intentionally differs from the current docs, which still describe soft delete via `deleted_at`. The docs and Prisma schema should be updated before implementation so the source of truth does not split.

The backend is currently in the foundation stage: Express, Prisma, middleware, response helpers, and shallow domain modules exist, but most modules only expose health endpoints and placeholder services. The main job now is to turn the documented MVP into reliable vertical slices.

## 0. Backend Principles To Keep Rechecking

- Build for the MVP first: personal progress tracking, text/voice entries, tasks, reminders, reflections, categories/trackers, Google Calendar import, billing, quotas, and admin AI model routing.
- Keep modules shallow by default: `routes`, `controller`, `service`, `schema`, and `types` at the module root until a module is genuinely too large.
- Controllers coordinate HTTP only. Services own domain logic, Prisma calls, transactions, and workflow decisions.
- Validate all request bodies, params, and query strings with Zod at the controller boundary.
- Use consistent responses:
  - success: `{ success: true, message, data, meta }`
  - error: `{ success: false, message, error: { code, details } }`
- Require authentication for all user data endpoints. Never trust a client-provided `user_id`.
- Enforce ownership in both route-level guards and service-level checks.
- Use hard delete for user deletion actions. Deleted records should be physically removed, except where a separate domain state is required for sync/history, such as imported calendar events marked `cancelled` or `removed`.
- Use CUIDs for IDs and preserve the existing Prisma naming style.
- Use `created_at` from the client where the docs require it, and keep `ingested_at` as server receive time.
- Use Prisma transactions for workflows that must be all-or-nothing, especially task finalize/re-finalize.
- Keep selects/includes minimal and avoid N+1 query patterns.
- Use Pino structured logs with request IDs and `ai_request_id` where relevant.
- AI output must be schema-validated before persistence. Retry malformed AI JSON once, then fail safely or fall back exactly as documented.
- BullMQ/Redis should handle reminders, calendar sync, reflection summary refreshes, and other async workflows.
- Tests should focus first on service/domain logic, API + DB integration behavior, ownership enforcement, hard-delete cascades/restrictions, and transaction rollback.

## 1. Phase One: Foundation Hardening

Goal: make the API base dependable before feature logic grows on top of it.

### 1.1 Verify Runtime And Tooling

- Confirm `pnpm` scripts work from the monorepo root and from `apps/api`:
  - `pnpm --filter api check-types`
  - `pnpm --filter api lint`
  - `pnpm --filter api build`
- Confirm the generated Prisma client path matches `prisma/schema.prisma` and `src/config/database.ts`.
- Confirm `.env` loading works for local development.
- Add missing required env schema entries:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `OPENROUTER_API_KEY`
  - auth provider client IDs/secrets when auth implementation starts
  - billing provider settings when billing implementation starts
- Decide how local tests will provision Postgres and Redis.

### 1.2 Normalize Common Infrastructure

- Review and align formatting/import style in `src/config/database.ts` with the rest of the API.
- Ensure database connection setup is imported only by runtime entry points, not by files that should stay pure for tests.
- Add or confirm common helpers for:
  - delete helpers that make hard-delete behavior explicit per domain
  - pagination normalization
  - date parsing and day boundaries
  - timezone normalization
  - request user extraction
  - operation/request ID generation
- Add typed `AppError` usage across all modules:
  - validation error
  - auth required
  - forbidden
  - not found
  - conflict
  - quota exceeded
  - AI provider failure
- Ensure error middleware never leaks stack traces in production.

### 1.3 Establish Test Harness

- Choose and configure the API test runner.
- Add unit test setup for services.
- Add integration test setup for Express + test database.
- Add a test database cleanup strategy that is clearly separate from production hard-delete behavior.
- First smoke tests:
  - `GET /api/v1/health`
  - unknown route returns standard error response
  - validation errors return standard error response

### 1.4 Hard Delete Data Model Revision

The current Prisma schema includes `deleted_at` across most tables because the original docs required soft delete. With the new hard-delete decision, revise the schema deliberately instead of leaving unused soft-delete fields around.

Implement:

- Remove `deleted_at` from normal user-owned domain tables unless a table has a separate non-delete archival/sync reason.
- Review every relation `onDelete` behavior:
  - use `Cascade` only where child records have no useful life without the parent
  - use `Restrict` where deletion should be blocked until dependent records are handled
  - use `SetNull` where history can remain meaningful without the deleted parent
- Decide deletion behavior for each domain:
  - entries: hard delete entry and dependent audio/tracker records where appropriate
  - tasks: hard delete native task items on user delete action
  - task re-finalize omissions: hard delete omitted generated/native items unless preserving an imported sync state is required
  - categories: restrict deletion if entries/tasks/trackers still reference them, or move references to `Uncategorized` before deleting
  - tracker definitions: restrict if records exist, or delete records as an explicit destructive action
  - user account deletion: define a full cascading/anonymization policy before implementing
- Remove normal "include deleted" admin/debug paths from the plan.
- Update docs that still require soft delete:
  - `docs/CONTEXT.md`
  - `docs/architecture/00-context-full.md`
  - `docs/architecture/01-mvp-product-context.md`
  - `docs/architecture/02-task-planning-and-runtime-model.md`
  - `docs/engineering/soft-delete-and-query-filtering-rules.md`
  - `docs/engineering/testing-strategy.md`

Acceptance criteria:

- Prisma schema no longer suggests soft delete as the default behavior.
- Each relation has an intentional delete policy.
- Tests cover both successful hard delete and blocked delete cases.

### 1.5 Repository Layer Decision

Docs say Prisma access should use a repository layer. Decide the exact local shape before building features:

- Option A: lightweight module-local repository files, e.g. `entries.repository.ts`.
- Option B: keep Prisma in services until a module has enough complexity, but document this as an intentional temporary deviation.

Preferred direction: module-local repositories for domains with meaningful DB access (`entries`, `tasks`, `reflections`, `calendar`, `billing`, `admin`) and direct service usage only for trivial lookup flows.

Acceptance criteria:

- API can start locally.
- Typecheck, lint, and build pass.
- Database connection and Prisma client generation are documented and repeatable.
- Common error, response, auth placeholder, and hard-delete patterns are ready for real modules.

## 2. Phase Two: Auth, Users, And Onboarding

Goal: create the identity and default user state every later workflow depends on.

### 2.1 Auth Module

MVP rule: sign-in required at first launch with Google + Apple. No anonymous-first flow.

Implement:

- OAuth/token verification entry points for Google and Apple.
- `auth_accounts` linking by provider and provider account ID.
- User creation/update on first verified login.
- Session/JWT strategy for mobile and web clients.
- `requireAuth` middleware that attaches authenticated user context to `req`.
- `requireAdmin` middleware for admin-only routes.
- Logout/session invalidation if applicable to the chosen auth approach.

Rules:

- Do not trust email alone for identity linking.
- Do not expose provider tokens in responses or logs.
- Redact sensitive auth payloads in logs.
- Keep auth routes versioned under `/api/v1/auth`.

Acceptance criteria:

- User can sign in with Google.
- User can sign in with Apple.
- Authenticated endpoints reject missing/invalid credentials.
- `req.user.id` is available to downstream controllers/services.

### 2.2 Users Module

Implement:

- Get current profile.
- Update display name, photo URL if needed, timezone preferences if owned by the user.
- Return subscription tier and onboarding status needed by clients.
- Account deletion/deactivation policy can be deferred unless needed immediately.

Rules:

- All user reads/writes are scoped to the authenticated user unless admin-only.
- Do not let clients mutate quota counters directly.

Acceptance criteria:

- `GET /users/me` returns the current user.
- User profile updates cannot target another user.

### 2.3 Onboarding Module

MVP rules:

- 2-step quick start.
- Skippable.
- Category selection: min 3, max 5.
- Defaults if skipped:
  - categories: Work/Projects, Learning, Personal/Wellbeing
  - reminder times: 9:00 AM and 9:00 PM
  - monthly reflection ON
  - weekly reflection OFF

Implement:

- Get onboarding state.
- Complete onboarding with selected categories and settings.
- Skip onboarding and apply defaults.
- Create default `user_settings`.
- Create default categories and hidden system `Uncategorized`.
- Mark `onboarding_completed_at`.

Rules:

- One onboarding state per user.
- The operation should be idempotent or safely reject duplicate completion.
- Category slugs must be unique per user.

Acceptance criteria:

- New user can skip onboarding and receive default settings/categories.
- New user can complete onboarding with 3-5 categories.
- Duplicate category names are normalized or rejected consistently.
- Later entry/task flows can rely on categories and settings existing.

## 3. Phase Three: Categories And Trackers

Goal: support user-defined life areas and the tracker definitions needed for structured progress records.

### 3.1 Categories

MVP rules:

- No required manual category at log time.
- AI can auto-categorize from user-selected categories.
- `Uncategorized` is a hidden system category unless used.
- Users can manually recategorize a single entry.
- Categories are shared by entries, tasks, and tracker definitions.

Implement:

- List active categories.
- Include `Uncategorized` only if used or explicitly requested by an admin/debug path.
- Create category.
- Rename category.
- Delete category if not system-protected and dependency rules allow it.
- Validate slug uniqueness per user.

Rules:

- System categories cannot be renamed/deleted through normal user flows.
- Deleting a category must not accidentally destroy entries/tasks; either restrict deletion while referenced or explicitly move references to `Uncategorized`.

Acceptance criteria:

- User can manage categories without affecting other users.
- Hidden `Uncategorized` behaves as documented.

### 3.2 Tracker Definitions

MVP rules:

- Tracker definitions attach to categories.
- Supported field types: number, currency, boolean, text, rating, duration, count.
- Frequencies: daily, weekly, monthly, custom.
- AI-created tracker records link to source entry and include `ai_request_id`.
- Ambiguous AI tracker values should not be silently saved.

Implement:

- CRUD tracker definitions.
- CRUD tracker fields inside a tracker definition.
- Activate/deactivate tracker definitions.
- Validate field config by field type.
- List trackers by category.

Acceptance criteria:

- User can define a tracker under one of their categories.
- Tracker field keys are unique within a tracker definition.
- Inactive trackers are excluded from normal extraction context. Deleted tracker definitions are physically removed only when dependency rules allow it.

### 3.3 Tracker Records

Implement:

- Manual tracker record creation.
- List records by date range/category/tracker.
- Link AI-extracted records to source entries.
- Store confidence and `ai_request_id`.

Rules:

- AI extraction should occur as part of the daily log AI workflow and should not consume a separate quota unless pricing changes.
- Low-confidence/ambiguous records should be skipped or marked for later review, not treated as normal confirmed data.

Acceptance criteria:

- Manual records work before AI extraction is complete.
- AI-created records are traceable to entry and request.

## 4. Phase Four: Entries And Daily Logging

Goal: make the core success metric possible: a used day is at least one finalized saved entry.

### 4.1 Entry Data Flow

MVP rules:

- Entries can be text, voice, or both.
- Multiple entries per day.
- Drafts do not count toward used days/streaks.
- Finalized timestamp is used for metrics/streaks.
- Backdating allowed up to 5 days.
- Future-dating is not supported.
- Users can edit/delete past logs.
- Text max length: 6,000 characters.

Implement:

- Create text draft.
- Update draft.
- Finalize draft.
- Create finalized text entry directly when no AI refine is requested.
- List entries by day/date range.
- Get entry detail.
- Edit finalized entry text/category/date under backdate rules.
- Hard-delete entry with confirmation handled by client.
- Recategorize a single entry.

Rules:

- Use `created_at` from client where required and `ingested_at` from server.
- Future entry dates are rejected.
- Backdated entries set `is_backdated`.
- `status=finalized` is the only status that counts toward streaks and logging rate.

Acceptance criteria:

- User can save at least one finalized text entry for today.
- User can list today's finalized entries.
- Drafts do not appear in finalized-only lists unless requested.
- Deleted entries are gone from normal reads and analytics.

### 4.2 Voice And Audio Metadata

MVP rules:

- English only.
- Voice recording cap: 4 minutes.
- Auto-stop handled client-side, backend enforces cap.
- Flow: transcribe -> light refine -> user reviews -> finalize save.
- Save original audio and refined text.
- Store raw transcript and refined text.
- Audio storage format: single standard format.

Implement:

- Decide storage provider/interface for audio files.
- Add upload endpoint or signed-upload flow.
- Persist `entry_audio` metadata.
- Enforce duration and file size limits.
- Link audio to entry draft/finalized entry.
- Keep raw transcript and refined text separate.

Acceptance criteria:

- Backend can persist audio metadata for an entry.
- Invalid/oversized audio is rejected.
- Audio storage keys are not guessable public URLs unless intentionally configured.

### 4.3 Entry AI Refinement And Categorization

MVP rules:

- Text flow: user chooses whether to use AI refine.
- Voice flow: transcribe + light refine counts as 1 AI action.
- AI auto-categorizes from user-selected categories.
- AI category JSON is schema-validated.
- On schema failure: 1 retry.
- If still invalid: save as `Uncategorized`.
- Auto-categorization does not consume a separate extra quota.

Implement:

- Entry refine request.
- Voice transcription/refine workflow.
- Category classification prompt and schema.
- Fallback to `Uncategorized`.
- AI usage event creation for quota-counted actions.
- Store `ai_request_id` on entries and tracker records.

Acceptance criteria:

- User can refine text before final save.
- AI malformed category output retries once.
- Fallback category works without blocking the entry save.
- Quota is counted only for features that should count.

## 5. Phase Five: Tasks And Planning

Goal: implement the hybrid task model: AI-friendly plan JSON plus reliable row-level task items.

### 5.1 Manual Task Runtime

MVP rules:

- Tasks are day-level only.
- UI statuses: pending, done, skipped.
- Users can manually create tasks.
- Task category is optional.
- Task deletion is hard delete.
- Task order supports drag-and-drop with instant save.
- Task order is independent per day.
- Soft cap: 50 tasks/day warning-only; users can exceed.
- No future-day task scope/actions in MVP.

Implement:

- Create manual task for today/past date.
- List tasks for date.
- Update title, notes, category, status.
- Reorder tasks for date.
- Hard-delete task.
- Count tasks by status for end-of-day summary.

Rules:

- Reject future-day task operations.
- Imported task core fields are not editable, but local status updates are allowed.
- Normal task interactions update `task_items`, not `task_plans.tasks_json`.

Acceptance criteria:

- User can manage a daily checklist.
- Status counts are available.
- Reordering persists without shifting unrelated dates.

### 5.2 Copy Yesterday's Tasks

MVP rules:

- Users can copy yesterday's tasks into today.
- Copied tasks keep categories and become `pending`.
- No auto-rollover.

Implement:

- Endpoint to copy previous day's active native tasks.
- Avoid duplicate copies if operation is retried.
- Exclude removed imported tasks unless product explicitly says otherwise.

Acceptance criteria:

- User can copy yesterday's checklist once safely.
- Copied tasks have `origin=copied` and `status=pending`.

### 5.3 AI Task Plan Drafts

MVP rules:

- Brain-dump-to-plan is explicit trigger.
- Generated plan output is a simple checklist.
- Generated tasks are saved immediately, then user can edit/update.
- AI-generated tasks hard max: 15.
- If model returns more than 15, keep first 15.
- One task plan record per user per day.
- Draft lifecycle: `draft -> saving -> finalized -> failed`.
- Track `ai_request_id`.
- Draft versioning uses `tasks_json` and `former_tasks_json`.

Implement:

- Generate plan from text first.
- Add audio guidance later using the same AI/audio pipeline.
- Save plan draft JSON immediately.
- Regenerate from current task items + additional guidance.
- Rotate `tasks_json` into `former_tasks_json` on overwrite.
- Validate AI JSON strictly and retry malformed output once.
- Preserve existing state on AI failure.

Acceptance criteria:

- User can generate a task plan draft for today/past date.
- Plan JSON is saved before finalization.
- Regenerate preserves previous draft.
- Malformed AI output does not corrupt existing tasks.

### 5.4 Finalize/Re-finalize Plan

MVP rules:

- Finalized `task_items` are source of truth.
- Finalize/re-finalize writes run in a single DB transaction.
- Backend rejects duplicate finalize attempts with a simple state guard.
- Re-finalize sync:
  - update matched items by CUID
  - create new items as `pending`
  - hard-delete omitted items, except imported/sync-controlled items that need a provider state transition
- Finalize accepts client `operation_id` for safe retry behavior.
- On failure, no changes are applied and retry is allowed.

Implement:

- Finalize endpoint.
- Re-finalize endpoint or unified finalize handler.
- Transactional item sync.
- Operation ID idempotency behavior.
- State guard around `saving`.
- Tests for success and rollback.

Acceptance criteria:

- Finalize creates task rows from plan JSON atomically.
- Re-finalize updates, creates, and hard-deletes omitted non-imported items exactly as documented in this plan.
- Duplicate finalize does not duplicate rows.
- Failed finalize leaves previous task state intact.

## 6. Phase Six: AI Provider, Quotas, And Admin Routing

Goal: centralize AI calls so entries, tasks, reflections, trackers, and admin config all use the same safe path.

### 6.1 AI Provider Layer

MVP rules:

- Provider: OpenRouter.
- Default model family: Qwen.
- Backup model configurable.
- Model routing must be easy to change from backend admin settings.

Implement:

- OpenRouter provider client.
- Shared AI request wrapper with:
  - timeout
  - retries where safe
  - request ID
  - provider/model logging
  - redaction
  - schema validation hook
- Model config resolver from `admin_model_configs`.
- Fallback model path.
- Typed methods for:
  - entry refine
  - voice transcript refine
  - category classification
  - tracker extraction
  - task generation/regeneration
  - reflection generation/update

Acceptance criteria:

- AI calls do not live directly inside controllers.
- Every AI response is validated before persistence.
- `ai_request_id` is available to logs and persisted records.

### 6.2 Quota Enforcement

MVP rules:

- Free tier AI quota: 50 AI actions/month.
- Paid tier: unlimited.
- If free quota exhausted, core logging still works, AI features pause.
- Auto-categorization does not consume separate quota.
- Task/reflection successful AI responses count.
- Failed attempts/retries do not add extra count.

Implement:

- Quota check helper.
- AI usage event recording.
- Monthly reset behavior.
- Feature-specific `count_toward_quota` rules.
- Quota exceeded app error.

Acceptance criteria:

- Free user cannot exceed AI quota for quota-counted features.
- Failed AI responses do not consume quota.
- Non-AI core entry save still works after quota exhaustion.

### 6.3 Admin AI Model Config

MVP rules:

- Single super admin.
- Super admin created manually via secure backend setup.
- AI model/provider config editable from admin settings.
- Changes apply immediately.
- One-click rollback to previous model config.
- Admin audit log deferred.

Implement:

- Admin guard.
- Create/list model configs.
- Set active model config.
- Roll back to previous config.
- Manual super-admin setup path or documented script.

Acceptance criteria:

- Non-admin users cannot access admin routes.
- Active model config is used by new AI requests without server restart.
- Rollback switches active config safely.

## 7. Phase Seven: Reflections And Analytics

Goal: produce weekly/monthly progress summaries using the documented review model.

### 7.1 Stats And Streaks

MVP rules:

- Streak rule: at least 1 finalized entry/day.
- Missed day resets streak to zero.
- Primary dashboard stat: month-to-date logging rate.
- Monthly reflection simple stats:
  1. Days logged
  2. Total entries
  3. Task completion rate
- Task completion includes native and imported tasks.

Implement:

- Current streak service.
- Month-to-date logging rate.
- Days logged by period.
- Total finalized entries by period.
- Task completion rate by period.
- Deleted records are physically absent from stats queries.

Acceptance criteria:

- Dashboard can show streak and logging rate.
- Reflection generation can reuse stats service.

### 7.2 Reflection Summary Cache

MVP rules:

- Reflection prompt context includes summarized task outcomes and logged progress.
- Context uses cached period summary.
- Cache refresh triggers on create/edit/delete/status/category/date changes.
- Refresh strategy: debounced queued refresh, 30 seconds.
- Explicit reflection generate/update forces immediate refresh first.

Implement:

- Period summary builder.
- `reflection_summary_caches` read/write service.
- Queue job for debounced refresh.
- Immediate refresh path for generate/update.
- Event hooks from entries/tasks/categories.

Acceptance criteria:

- Cache is refreshed after relevant data changes.
- Reflection generation can force fresh context.

### 7.3 Reflection Drafts And Publishing

MVP rules:

- Reflection cadence: weekly/monthly/both.
- Defaults: monthly ON, weekly OFF.
- Weekly boundaries: Sunday -> Saturday.
- Reflection output: AI draft + user edit/confirm.
- Status: `draft -> published`.
- Exactly one reflection per user per period.
- Published reflections remain editable.
- Versioning keeps current + one previous.
- AI update suggestions require user accept.

Implement:

- Get/create reflection for period.
- Generate AI draft.
- Regenerate AI draft.
- Manual edit.
- Publish.
- Update published reflection.
- Keep `previous_text` on save/update.

Acceptance criteria:

- User can generate and publish a monthly reflection.
- Weekly period uses Sunday-Saturday.
- Duplicate reflection per period is prevented.
- Published reflection can be edited.

## 8. Phase Eight: Calendar Integration

Goal: import Google Calendar read-only into OnTrack task items.

### 8.1 Google Calendar Connection

MVP rules:

- Google Calendar only.
- Read-only import.
- User can disconnect anytime.
- Disconnect stops future sync immediately but keeps existing imported records/history.
- First connect imports upcoming only.
- Reconnect resumes from current date/time forward.

Implement:

- OAuth connect callback.
- Store encrypted or otherwise protected access/refresh tokens.
- Disconnect endpoint.
- Refresh token handling.
- Connection status endpoint.

Acceptance criteria:

- User can connect/disconnect Google Calendar.
- Disconnect does not delete history.

### 8.2 Calendar Sync

MVP rules:

- Sync cadence: on app open + manual refresh.
- Manual refresh syncs rolling window: now -> next 30 days.
- Dedupe/update by provider event identity.
- Deleted/cancelled source events become removed/cancelled locally.
- Removed imported tasks are hidden by default and sync-controlled.
- Recurring events create per-occurrence task instances.
- Timed events keep optional time metadata.
- Event timezone data is preserved.
- No automatic reminders for imported events.

Implement:

- BullMQ sync job.
- Manual refresh endpoint.
- Upsert imported events and linked `task_items`.
- Occurrence-level dedupe.
- Mark cancelled/removed items.
- Preserve raw provider payload for debugging.

Acceptance criteria:

- Manual sync imports upcoming events as task items.
- Re-sync updates changed events without duplicates.
- Cancelled/removed events are hidden by default.

### 8.3 Calendar API For UI

MVP API shape:

- `GET /calendar/month-summary?month=YYYY-MM`
- `GET /calendar/day?date=YYYY-MM-DD`
- `POST /calendar/sync/google/refresh`

Implement:

- Month summary with per-day indicators/counts.
- Day endpoint returning native + imported items.
- Stale-while-revalidate friendly responses.

Acceptance criteria:

- Calendar month view can render indicators without loading every task payload.
- Day view can show checklist/agenda for selected date.

## 9. Phase Nine: Reminders And Notifications

Goal: support the MVP reminder system using user settings, tasks, entries, and queues.

MVP rules:

- Daily reminders:
  - morning plan/intention
  - night reflection/progress
- Default follow-up nudge: 1.
- Configurable follow-up count and times.
- Max 3 follow-up nudges/day.
- Quiet hours included.
- Timezone-aware and follows device timezone.
- Pending-task reminder is separate from general night reflection reminder.
- One evening reminder can nudge when tasks remain pending.

Implement:

- Reminder settings endpoints.
- Queue scheduler for daily reminders.
- Follow-up nudge scheduling with cap.
- Quiet-hours suppression/rescheduling.
- Pending-task reminder check.
- Notification provider interface.
- Optional delivery history table later when execution/auditability is needed.

Acceptance criteria:

- User settings can configure reminders.
- Scheduler respects timezone and quiet hours.
- Pending-task reminder only fires when enabled and tasks remain pending.

## 10. Phase Ten: Billing And Subscriptions

Goal: enforce the simple MVP pricing model and connect it to AI quota behavior.

MVP rules:

- Paid launch plan: $2/month.
- Freemium accessibility.
- Free users get 50 AI actions/month.
- Paid users get unlimited AI usage.
- Billing state lives in `subscriptions` as well as useful summary fields on `users`.

Implement:

- Billing provider decision/configuration.
- Create checkout/session endpoint.
- Subscription webhook handler.
- Update `subscriptions`.
- Reflect active tier/status on `users`.
- Billing portal/customer management if provider supports it.

Rules:

- Webhooks must be idempotent.
- Do not trust client-side billing status.

Acceptance criteria:

- Paid subscription updates user tier.
- Cancelled/past-due states are represented.
- AI quota logic reads accurate tier/status.

## 11. Phase Eleven: Security, Privacy, And Data Protection

Goal: satisfy MVP privacy/security requirements before dogfooding with real personal data.

MVP rules:

- User logs are not used for model training.
- Encryption in MVP: server-side encryption at rest + TLS in transit.
- End-to-end encryption later.

Implement/check:

- Redaction for logs containing entries, transcripts, tokens, provider payloads, and billing details.
- CORS configuration for real app origins.
- Helmet remains enabled.
- Request body limits for text and upload endpoints.
- Rate limiting for auth, AI, and write-heavy endpoints.
- Token encryption or secure secret storage for calendar provider tokens.
- Document AI provider data-use assumptions and disable training where provider supports it.
- Admin routes are explicitly guarded.

Acceptance criteria:

- Sensitive user content is not logged in plaintext.
- Provider secrets/tokens are never returned to clients.
- Admin-only behavior is protected by tests.

## 12. Phase Twelve: Production Readiness

Goal: make the API deployable and operable.

Implement/check:

- Health/readiness endpoints:
  - process health
  - database readiness
  - Redis readiness
- Graceful shutdown for HTTP server, Prisma, Redis, and workers.
- Structured logs in API and workers.
- Request ID propagation.
- AI request ID propagation.
- Migration workflow.
- Seed/setup scripts for local dev and super admin.
- Deployment env documentation.
- Basic OpenAPI or route documentation if useful for mobile/web work.

Acceptance criteria:

- API can be deployed with documented env vars.
- Workers can run separately from the HTTP API if needed.
- Failures are visible in logs with request IDs.

## 13. Suggested Build Order

Use this order unless a frontend/mobile integration need forces a different vertical slice:

1. Foundation hardening.
2. Auth + users + onboarding defaults.
3. Categories.
4. Text entries without AI.
5. Dashboard stats: used day, streak, month-to-date logging rate.
6. Manual tasks.
7. Task finalize/re-finalize infrastructure.
8. AI provider wrapper + quotas.
9. Entry AI refine/categorization.
10. AI task generation/regeneration.
11. Reflections and summary cache.
12. Tracker definitions and tracker records.
13. Google Calendar import.
14. Reminders and notification scheduling.
15. Billing/subscription webhooks.
16. Admin model routing.
17. Security hardening and production readiness.

This order gives the app a usable personal loop early:

1. Sign in.
2. Onboard categories/settings.
3. Save finalized entries.
4. See streak/logging rate.
5. Manage daily tasks.
6. Add AI assistance after the manual loop is reliable.

## 14. Critical Test Checklist

Add tests as each feature lands. Do not leave these until the end.

- Auth rejects missing/invalid credentials.
- User ownership is enforced on every user-data mutation.
- Admin routes reject non-admin users.
- Hard delete removes user-deleted rows and related tests verify the intended cascade/restrict behavior.
- Entry drafts do not count toward streaks.
- Finalized entries count toward used days.
- Backdating works up to 5 days and rejects older/future dates.
- Text entry max length is enforced.
- Category slug uniqueness is enforced per user.
- `Uncategorized` fallback works after AI category failure.
- Free AI quota blocks AI features after 50 counted successful actions.
- Failed AI attempts do not consume quota.
- Task future-day operations are rejected.
- Task reorder affects only one user and one day.
- Copy yesterday is safe to retry.
- Task finalize transaction rolls back on failure.
- Task re-finalize updates, creates, and hard-deletes omitted non-imported items correctly.
- AI malformed JSON retries once.
- Reflection weekly boundaries are Sunday-Saturday.
- Reflection uniqueness per user/period is enforced.
- Reflection cache refresh is triggered by entry/task changes.
- Calendar sync dedupes recurring event occurrences.
- Calendar disconnect stops future sync and preserves history.
- Reminder scheduling respects timezone and quiet hours.
- Billing webhooks are idempotent.

## 15. Open Decisions To Resolve Before Implementation

- Exact auth/session strategy for mobile/web after Google/Apple verification.
- Exact billing provider for the $2/month plan.
- Audio storage provider and signed-upload approach.
- Notification provider for mobile reminders.
- Whether to add module-local repository files immediately or only for complex domains.
- Whether `docs/CONTEXT.md` should be the canonical context file, since `docs/README.md` currently refers to a root `CONTEXT.md` that is not present.
