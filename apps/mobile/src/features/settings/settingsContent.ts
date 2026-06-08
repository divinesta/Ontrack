import { Ionicons } from "@expo/vector-icons";

export type SettingRoute = {
  key: string;
  title: string;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  accent?: "mint" | "dark" | "leaf" | "warning" | "danger";
};

export type SettingGroup = {
  key: string;
  title: string;
  routes: SettingRoute[];
};

export const settingGroups: SettingGroup[] = [
  {
    key: "daily",
    title: "Daily rhythm",
    routes: [
      {
        key: "categories-trackers",
        title: "Categories & Trackers",
        detail: "Life areas, custom fields, frequency, units, and AI extraction.",
        icon: "shapes-outline",
        route: "/settings/trackers",
        accent: "mint",
      },
      {
        key: "reminders",
        title: "Reminders",
        detail: "Morning plan, night reflection, follow-up nudges, and quiet hours.",
        icon: "notifications-outline",
        route: "/settings/reminders",
        accent: "leaf",
      },
      {
        key: "calendar",
        title: "Calendar",
        detail: "Google Calendar import, sync status, and imported task behavior.",
        icon: "calendar-outline",
        route: "/settings/calendar",
      },
    ],
  },
  {
    key: "review",
    title: "Review system",
    routes: [
      {
        key: "reflections",
        title: "Reflections",
        detail: "Weekly/monthly cadence, AI drafts, and published reflection settings.",
        icon: "sparkles-outline",
        route: "/settings/reflections",
        accent: "mint",
      },
      {
        key: "ai",
        title: "AI & Quota",
        detail: "Model usage, free monthly quota, extraction behavior, and fallback states.",
        icon: "hardware-chip-outline",
        route: "/settings/ai",
        accent: "dark",
      },
      {
        key: "privacy",
        title: "Privacy & Data",
        detail: "Soft delete rules, encryption posture, logs, and account data controls.",
        icon: "lock-closed-outline",
        route: "/settings/privacy",
      },
    ],
  },
  {
    key: "account",
    title: "Account",
    routes: [
      {
        key: "profile",
        title: "Profile",
        detail: "Name, sign-in providers, timezone, and account details.",
        icon: "person-circle-outline",
        route: "/settings/profile",
      },
      {
        key: "billing",
        title: "Billing",
        detail: "Free tier, paid plan, subscription status, and billing period.",
        icon: "card-outline",
        route: "/settings/billing",
        accent: "warning",
      },
      {
        key: "admin",
        title: "Admin",
        detail: "Super admin model configuration and rollback controls.",
        icon: "shield-checkmark-outline",
        route: "/settings/admin",
        accent: "dark",
      },
    ],
  },
];

export const trackerSignals = [
  { label: "Workout", value: "30 min", icon: "barbell-outline" as const },
  { label: "Spending", value: "NGN 2.5k", icon: "cash-outline" as const },
  { label: "Reading", value: "2 hrs", icon: "book-outline" as const },
];

export const reminderSummary = [
  { label: "Morning", value: "9:00 AM" },
  { label: "Night", value: "9:00 PM" },
  { label: "Quiet", value: "10 PM-7 AM" },
];
