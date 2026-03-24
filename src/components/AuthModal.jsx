import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useModal } from '../context/ModalContext'
import { useLanguage } from '../context/LanguageContext'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Supabase error message → i18n key
function mapError(err) {
  if (!err) return null
  const msg = err.message?.toLowerCase() ?? ''
  if (msg.includes('invalid login credentials'))                      return 'auth.error.invalidCredentials'
  if (msg.includes('user already registered') ||
      msg.includes('already been registered'))                        return 'auth.error.emailInUse'
  if (msg.includes('password should be at least'))                   return 'auth.error.weakPassword'
  if (msg.includes('fetch') || msg.includes('network'))              return 'auth.error.network'
  if (msg.includes('cancelled') || msg.includes('canceled') ||
      msg.includes('oauth') || msg.includes('popup_closed'))         return 'auth.error.oauthCancelled'
  return 'auth.error.unknown'
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function AuthModal() {
  const { authOpen, setAuthOpen }   = useAuth()
  const { isOpen: serviceOpen, closeModal } = useModal()
  const { t }                       = useLanguage()
  const reduced                     = useReducedMotion()

  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail]         = useState('')
  const [password, setPass]       = useState('')
  const [name, setName]           = useState('')
  const [error, setError]         = useState(null)
  const [loading, setLoading]     = useState(false)

  const firstFocusRef = useRef(null)
  const modalRef      = useRef(null)

  // Note: when authOpen becomes true and serviceOpen is also true, this effect calls closeModal()
  // which updates serviceOpen → triggers one re-run → serviceOpen is now false, no further loop.
  // Intentional single-cycle re-render.
  // Scroll lock + dual-modal handling
  useEffect(() => {
    if (authOpen) {
      if (serviceOpen) closeModal()
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
      setTimeout(() => firstFocusRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [authOpen, serviceOpen, closeModal])

  // Clear stale pendingAction when modal is dismissed without signing in
  useEffect(() => {
    if (!authOpen) {
      sessionStorage.removeItem('pendingAction')
    }
  }, [authOpen])

  // Escape key + focus trap
  useEffect(() => {
    if (!authOpen) return

    function onKey(e) {
      if (e.key === 'Escape') { handleClose(); return }
      if (e.key !== 'Tab') return

      const focusable = modalRef.current?.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [authOpen])

  const handleClose = useCallback(() => {
    setAuthOpen(false)
    setError(null)
    setEmail('')
    setPass('')
    setName('')
    setActiveTab('login')
  }, [setAuthOpen])

  const switchTab = useCallback((tab) => {
    setActiveTab(tab)
    setError(null)
  }, [])

  async function handleEmailAuth(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = activeTab === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })

      if (result.error) {
        setError(t(mapError(result.error)))
      } else {
        handleClose()
      }
    } catch {
      setError(t('auth.error.network'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/' },
      })
      if (error) setError(t(mapError(error)))
    } catch {
      setError(t('auth.error.network'))
    } finally {
      setLoading(false)
    }
  }

  const overlayAnim = reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
  const modalAnim   = reduced ? {} : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 } }
  const transition  = { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }

  return (
    <AnimatePresence>
      {authOpen && (
        <motion.div
          {...overlayAnim}
          transition={transition}
          onClick={handleClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: 'rgba(10,10,15,0.55)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <motion.div
            {...modalAnim}
            transition={transition}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[380px] rounded-[1.25rem] p-7"
            style={{
              background: 'rgba(19,19,25,0.75)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label={t('auth.close')}
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full text-[0.7rem] cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#acaab1',
              }}
            >✕</button>

            {/* Tab toggle */}
            <div
              className="flex gap-[3px] rounded-[0.55rem] p-[3px] mb-6"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {(['login', 'register']).map((tabKey) => (
                <button
                  key={tabKey}
                  ref={tabKey === 'login' ? firstFocusRef : null}
                  onClick={() => switchTab(tabKey)}
                  className="flex-1 text-center text-[0.78rem] rounded-[0.4rem] py-[0.42rem] cursor-pointer transition-all duration-200"
                  style={{
                    fontWeight: activeTab === tabKey ? 600 : 400,
                    color: activeTab === tabKey ? '#f9f5fd' : '#acaab1',
                    background: activeTab === tabKey ? 'rgba(124,58,237,0.22)' : 'transparent',
                    border: activeTab === tabKey ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
                  }}
                >
                  {t(`auth.tab.${tabKey}`)}
                </button>
              ))}
            </div>

            {/* Title + subtitle + form — animated on tab switch */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                {...(reduced ? {} : {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  exit:    { opacity: 0, y: -8 },
                  transition: { duration: 0.25, ease: 'easeOut' },
                })}
              >
                <h2
                  id="auth-modal-title"
                  className="mb-[0.3rem] text-[1.2rem] font-bold"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {t(`auth.${activeTab}.title`)}
                </h2>
                <p
                  className="mb-5 text-[0.75rem] leading-relaxed"
                  style={{ color: '#acaab1' }}
                >
                  {t(`auth.${activeTab}.subtitle`)}
                </p>

                {/* Form */}
                <form onSubmit={handleEmailAuth}>
                  {activeTab === 'register' && (
                    <div className="mb-3">
                      <label
                        className="mb-[0.3rem] block text-[0.7rem] font-medium"
                        style={{ color: '#acaab1' }}
                      >
                        {t('auth.register.name')}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder={t('auth.register.namePlaceholder')}
                        className="w-full rounded-[0.55rem] px-[0.8rem] py-[0.55rem] text-[0.8rem] outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          color: '#f9f5fd',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label
                      className="mb-[0.3rem] block text-[0.7rem] font-medium"
                      style={{ color: '#acaab1' }}
                    >
                      {t(`auth.${activeTab}.email`)}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t(`auth.${activeTab}.emailPlaceholder`)}
                      className="w-full rounded-[0.55rem] px-[0.8rem] py-[0.55rem] text-[0.8rem] outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        color: '#f9f5fd',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      className="mb-[0.3rem] block text-[0.7rem] font-medium"
                      style={{ color: '#acaab1' }}
                    >
                      {t(`auth.${activeTab}.password`)}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPass(e.target.value)}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      className="w-full rounded-[0.55rem] px-[0.8rem] py-[0.55rem] text-[0.8rem] outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        color: '#f9f5fd',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {error && (
                    <p className="mb-3 text-[0.75rem] text-[#f87171]" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mb-[0.85rem] w-full rounded-[0.6rem] py-[0.7rem] text-[0.82rem] font-bold text-white transition-opacity duration-150 disabled:cursor-not-allowed"
                    style={{
                      background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7C3AED, #F97316)',
                      border: 'none',
                      boxShadow: '0 0 20px rgba(124,58,237,0.3)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? '…' : t(`auth.${activeTab}.submit`)}
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div
              className="mb-[0.85rem] flex items-center gap-[0.65rem] text-[0.68rem]"
              style={{ color: '#55545b' }}
            >
              <div
                className="h-px flex-1"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />
              {t('auth.divider')}
              <div
                className="h-px flex-1"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-[0.55rem] rounded-[0.6rem] py-[0.62rem] text-[0.78rem] font-semibold cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f9f5fd',
              }}
            >
              <GoogleIcon />
              {t(`auth.${activeTab}.google`)}
            </button>

            {/* Switch tab */}
            <p
              className="mt-[0.85rem] text-center text-[0.72rem]"
              style={{ color: '#acaab1' }}
            >
              {t(`auth.${activeTab}.switchPrompt`)}{' '}
              <button
                onClick={() => switchTab(activeTab === 'login' ? 'register' : 'login')}
                className="cursor-pointer border-none bg-transparent text-[inherit] font-semibold"
                style={{ color: '#C084FC' }}
              >
                {t(`auth.tab.${activeTab === 'login' ? 'register' : 'login'}`)}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
