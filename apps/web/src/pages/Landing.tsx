import './Landing.css'

const features = [
  {
    tag: 'Capture',
    title: 'Speak or type your day',
    body: 'Voice logs up to four minutes. Text up to six thousand characters. AI refines when you want it — never when you do not.',
  },
  {
    tag: 'Plan',
    title: 'Brain dump → checklist',
    body: 'Hit one button. Your scattered thoughts become a day-level task list you can drag, edit, and finish.',
  },
  {
    tag: 'Reflect',
    title: 'Weekly and monthly reviews',
    body: 'AI drafts reflections from your logs and task outcomes. You edit, publish, and keep a record that actually means something.',
  },
]

export function Landing() {
  return (
    <div className="v1">
      <div className="v1-grain" aria-hidden="true" />

      <header className="v1-nav">
        <a className="v1-logo" href="/">
          On<span>Track</span>
        </a>
        <nav className="v1-nav-links" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/login">Log in</a>
          <a className="v1-nav-cta" href="/signup">
            Start tracking
          </a>
        </nav>
      </header>

      <main>
        <section className="v1-hero">
          <div className="v1-hero-copy">
            <p className="v1-eyebrow">Personal progress, without the pressure</p>
            <h1>
              Your days,
              <br />
              <em>remembered.</em>
            </h1>
            <p className="v1-sub">
              Log what you did. Plan what is next. Reflect on what mattered — voice, text, and AI that stays out of your way.
            </p>
            <div className="v1-cta-row">
              <a className="v1-btn v1-btn-primary" href="/signup">
                Start tracking
              </a>
              <a className="v1-btn v1-btn-ghost" href="/login">
                Log in
              </a>
            </div>
          </div>

          <div className="v1-hero-visual" aria-hidden="true">
            <div className="v1-orbit v1-orbit-a" />
            <div className="v1-orbit v1-orbit-b" />
            <div className="v1-phone">
              <div className="v1-phone-bar">
                <span>Today</span>
                <span className="v1-streak">12 day streak</span>
              </div>
              <ul className="v1-phone-list">
                <li className="v1-done">Shipped API auth flow</li>
                <li className="v1-done">Read 40 pages</li>
                <li>Morning run — 5k</li>
                <li>Voice log at 9:14 PM</li>
              </ul>
              <div className="v1-phone-wave">
                <span /><span /><span /><span /><span /><span /><span /><span />
              </div>
            </div>
          </div>
        </section>

        <section className="v1-proof" aria-label="Key metrics">
          <div>
            <strong>24/30</strong>
            <span>used days = MVP win</span>
          </div>
          <div>
            <strong>2×</strong>
            <span>daily reminders</span>
          </div>
          <div>
            <strong>AI</strong>
            <span>auto-categorizes logs</span>
          </div>
        </section>

        <section className="v1-features" id="features">
          <div className="v1-features-head">
            <h2>Built for the gap between doing and remembering</h2>
            <p>
              OnTrack is not another todo app. It is the layer that captures effort, turns noise into plans, and gives you honest reflections over time.
            </p>
          </div>
          <div className="v1-feature-grid">
            {features.map((f, i) => (
              <article key={f.tag} className="v1-feature" style={{ animationDelay: `${i * 120}ms` }}>
                <span className="v1-feature-tag">{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="v1-pricing" id="pricing">
          <div className="v1-pricing-card">
            <p className="v1-eyebrow">Simple pricing</p>
            <h2>$2 / month</h2>
            <p>Unlimited AI on paid. Core logging always free. No training on your data.</p>
            <a className="v1-btn v1-btn-primary" id="start" href="/signup">
              Start tracking
            </a>
          </div>
        </section>
      </main>

      <footer className="v1-footer">
        <span>OnTrack</span>
        <div className="v1-footer-links">
          <a href="/login">Log in</a>
          <a href="/signup">Sign up</a>
        </div>
      </footer>
    </div>
  )
}