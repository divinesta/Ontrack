import { signupHeroImage } from '../assets/onboardingImages'
import { AuthLayout } from '../components/AuthLayout'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c3.42-3.15 5.384-7.785 5.384-13.315z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}

export function Signup() {
  return (
    <AuthLayout
      imagePosition="right"
      imageSrc={signupHeroImage}
      imageAlt="Desk calendar and planner — organizing your days ahead"
      visualTitle="Start building a record you can trust."
      visualBody="Voice logs, daily plans, and reflections — all in one calm place."
    >
      <div className="auth-form-inner">
        <a className="auth-back" href="/">
          ← Back to home
        </a>
        <h1>Create your account</h1>
        <p>Join OnTrack and never lose track of what you actually did.</p>

        <div className="auth-oauth">
          <button type="button" className="auth-oauth-btn">
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        <div className="auth-divider">or sign up with email</div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="auth-field">
            <label htmlFor="signup-name">Full name</label>
            <input id="signup-name" type="text" name="name" placeholder="Your name" autoComplete="name" />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" name="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" name="password" placeholder="Create a password" autoComplete="new-password" />
          </div>
          <button type="submit" className="auth-submit">
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </AuthLayout>
  )
}