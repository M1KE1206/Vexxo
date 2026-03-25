// src/components/ProfileAvatar.jsx
import { useProfile } from '../hooks/useProfile'

const SIZES = {
  sm: { outer: 34, inner: 30, stroke: 13 },
  lg: { outer: 84, inner: 76, stroke: 28 },
}

// Gradient border via padding-box techniek (zelfde als .social-icon:hover in index.css)
function gradientBorderStyle(outerSize) {
  return {
    width: outerSize,
    height: outerSize,
    borderRadius: '9999px',
    background: 'linear-gradient(#0e0e13, #0e0e13) padding-box, linear-gradient(135deg, #7C3AED, #F97316) border-box',
    border: '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  }
}

export default function ProfileAvatar({ size = 'sm' }) {
  const { profile, loading } = useProfile()
  const { outer, inner, stroke } = SIZES[size] ?? SIZES.sm

  // Loading skeleton — voorkomt layout shift in navbar
  if (loading) {
    return (
      <div
        className="rounded-full animate-pulse shrink-0"
        style={{ width: outer, height: outer, background: 'var(--surface-container, #19191f)' }}
      />
    )
  }

  if (profile?.avatar_url) {
    return (
      <div style={gradientBorderStyle(outer)}>
        <img
          src={profile.avatar_url}
          alt="Profielfoto"
          width={inner}
          height={inner}
          style={{ width: inner, height: inner, borderRadius: '9999px', objectFit: 'cover' }}
        />
      </div>
    )
  }

  // Standaard user-icon SVG
  return (
    <div style={gradientBorderStyle(outer)}>
      <svg
        width={stroke}
        height={stroke}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#acaab1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  )
}
