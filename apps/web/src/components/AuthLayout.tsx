import type { ReactNode } from 'react'
import './AuthLayout.css'

type AuthLayoutProps = {
  imagePosition: 'left' | 'right'
  imageSrc: string
  imageAlt: string
  visualTitle: string
  visualBody: string
  children: ReactNode
}

export const AuthLayout = ({
  imagePosition,
  imageSrc,
  imageAlt,
  visualTitle,
  visualBody,
  children,
}: AuthLayoutProps) => {
  const visual = (
    <aside className="auth-visual">
      <img className="auth-visual-image" src={imageSrc} alt={imageAlt} />
      <div className="auth-visual-tint" aria-hidden="true" />
      <div className="auth-visual-content">
        <header className="auth-visual-header">
          <a className="auth-visual-logo" href="/">
            On<span>Track</span>
          </a>
        </header>
        <div className="auth-visual-quote-wrap">
          <blockquote className="auth-visual-quote">
            <p>{visualTitle}</p>
            <footer>{visualBody}</footer>
          </blockquote>
        </div>
      </div>
    </aside>
  )

  return (
    <div className={`auth ${imagePosition === 'right' ? 'auth--flip' : ''}`}>
      {visual}
      <section className="auth-form-panel">{children}</section>
    </div>
  )
}