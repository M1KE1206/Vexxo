// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useProfile } from '../hooks/useProfile'
import ProfileAvatar from '../components/ProfileAvatar'
import { fadeUp, staggerContainer } from '../lib/animations'

// ─── Per-veld inline editing component ───────────────────────────────────────
function ProfileField({ label, fieldKey, value, activeField, setActiveField, onSave, placeholder = '—' }) {
  const { t } = useLanguage()
  const mountedRef            = useRef(true)
  useEffect(() => () => { mountedRef.current = false }, [])
  const [draft, setDraft]     = useState(value ?? '')
  const [status, setStatus]   = useState('idle') // idle | editing | saving | error
  const [errMsg, setErrMsg]   = useState('')
  const inputRef              = useRef(null)

  const isActive = activeField === fieldKey

  // Sync wanneer externe value verandert (na save)
  useEffect(() => {
    if (status === 'idle') setDraft(value ?? '')
  }, [value, status])

  // Auto-annuleer wanneer een ander veld geactiveerd wordt
  useEffect(() => {
    if (!isActive && status !== 'idle') {
      setStatus('idle')
      setDraft(value ?? '')
    }
  }, [isActive, value, status]) // eslint-disable-line react-hooks/exhaustive-deps

  function startEdit() {
    setActiveField(fieldKey)
    setStatus('editing')
    setDraft(value ?? '')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function cancel() {
    setStatus('idle')
    setDraft(value ?? '')
    setActiveField(null)
  }

  async function save() {
    if (status !== 'editing') return
    if (draft.trim() === (value ?? '').trim()) { cancel(); return }
    setStatus('saving')
    try {
      await onSave(fieldKey, draft.trim())
      setStatus('idle')
      setActiveField(null)
    } catch {
      setStatus('error')
      setErrMsg(t('profile.edit.error'))
      setDraft(value ?? '')
      setTimeout(() => {
        if (!mountedRef.current) return
        setStatus('idle')
        setActiveField(null)
      }, 1500)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter')  { e.preventDefault(); save() }
    if (e.key === 'Escape') cancel()
  }

  return (
    <div className="group/field flex items-start justify-between py-3.5 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-[0.68rem] font-semibold uppercase tracking-wider mb-1" style={{ color: '#55545b' }}>
          {label}
        </p>
        {isActive && status !== 'idle' ? (
          <>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={status === 'saving'}
              className="w-full bg-transparent text-sm outline-none border-b pb-0.5 transition-colors"
              style={{ borderColor: '#7C3AED', color: '#f9f5fd' }}
            />
            {status === 'error' && (
              <p className="text-[0.7rem] text-red-400 mt-1">{errMsg}</p>
            )}
          </>
        ) : (
          <p className="text-sm" style={{ color: value ? '#f9f5fd' : '#55545b' }}>
            {value || placeholder}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 pt-5 shrink-0">
        {isActive && status === 'editing' && (
          <>
            <button onClick={save} className="p-1 rounded text-green-400 hover:bg-green-400/10 transition-colors" aria-label="Opslaan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            </button>
            <button onClick={cancel} className="p-1 rounded transition-colors hover:bg-white/5" aria-label="Annuleren" style={{ color: '#acaab1' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </>
        )}
        {isActive && status === 'saving' && (
          <div className="w-4 h-4 rounded-full border-2 border-t-[#7C3AED] border-[#7C3AED]/20 animate-spin" />
        )}
        {(!isActive || status === 'idle') && (
          <button
            onClick={startEdit}
            className="p-1 rounded opacity-0 group-hover/field:opacity-100 transition-opacity hover:bg-white/5"
            aria-label={`Bewerk ${label}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#acaab1" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Provider badge ───────────────────────────────────────────────────────────
function ProviderBadge({ provider }) {
  const isGoogle = provider === 'google'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-semibold"
      style={{
        background: isGoogle ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${isGoogle ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.1)'}`,
        color: isGoogle ? '#C084FC' : '#acaab1',
      }}
    >
      {isGoogle ? (
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )}
      {isGoogle ? 'Google' : 'Email'}
    </span>
  )
}

// ─── Glassmorphism kaart wrapper ──────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`glass-card rounded-2xl p-6 md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ─── Datum formatter ──────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Hoofdcomponent ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, setAuthOpen }       = useAuth()
  const { t }                       = useLanguage()
  const { profile, loading, updateField, uploadAvatar } = useProfile()
  const navigate                    = useNavigate()
  const [activeField, setActiveField] = useState(null)
  const [avatarError, setAvatarError] = useState('')
  const fileInputRef                = useRef(null)

  // Auth guard — wacht op user resolve, redirect als niet ingelogd
  const [authChecked, setAuthChecked] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setAuthChecked(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (authChecked && !user) {
      navigate('/', { replace: true })
      setAuthOpen(true)
    }
  }, [authChecked, user, navigate, setAuthOpen])

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError('')
    try {
      await uploadAvatar(file)
    } catch (err) {
      if (err.message === 'size') setAvatarError(t('profile.avatar.errorSize'))
      else if (err.message === 'type') setAvatarError(t('profile.avatar.errorType'))
      else setAvatarError(t('profile.edit.error'))
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (!authChecked || !user || loading) {
    return <div className="min-h-screen" style={{ background: 'var(--background)' }} />
  }

  const provider = user.app_metadata?.provider ?? 'email'

  return (
    <>
      <Helmet>
        <title>{t('profile.pageTitle')} — Vexxo Studio</title>
      </Helmet>

      <main className="relative z-10 pt-24 pb-20 px-6 md:px-8 max-w-5xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >

          {/* ── Hero card ── */}
          <Card>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar + upload */}
              <div className="relative shrink-0 group/avatar">
                <ProfileAvatar size="lg" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                  aria-label={t('profile.hero.editAvatar')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="sr-only"
                  aria-label={t('profile.avatar.upload')}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-headline font-extrabold mb-1 text-on-surface">
                  {profile?.full_name || user.email}
                </h1>
                <p className="text-sm mb-3 text-on-surface-variant">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <ProviderBadge provider={provider} />
                  <span className="text-[0.75rem] text-[var(--color-text-faint,#55545b)]">
                    {t('profile.hero.memberSince')} {formatDate(user.created_at)}
                  </span>
                </div>
                {avatarError && (
                  <p className="text-[0.75rem] text-red-400 mt-2">{avatarError}</p>
                )}
              </div>
            </div>
          </Card>

          {/* ── Midden grid: persoonlijke info + adres ── */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Persoonlijke gegevens */}
            <Card>
              <h2 className="text-sm font-headline font-bold mb-4 gradient-text">
                {t('profile.personalInfo.title')}
              </h2>
              <ProfileField
                label={t('profile.personalInfo.name')}
                fieldKey="full_name"
                value={profile?.full_name}
                activeField={activeField}
                setActiveField={setActiveField}
                onSave={updateField}
              />
              <ProfileField
                label={t('profile.personalInfo.phone')}
                fieldKey="phone"
                value={profile?.phone}
                activeField={activeField}
                setActiveField={setActiveField}
                onSave={updateField}
              />
            </Card>

            {/* Adres */}
            <Card>
              <h2 className="text-sm font-headline font-bold mb-4 gradient-text">
                {t('profile.address.title')}
              </h2>
              {[
                { key: 'address_street',  label: t('profile.address.street')  },
                { key: 'address_city',    label: t('profile.address.city')    },
                { key: 'address_zip',     label: t('profile.address.zip')     },
                { key: 'address_country', label: t('profile.address.country') },
              ].map(({ key, label }) => (
                <ProfileField
                  key={key}
                  label={label}
                  fieldKey={key}
                  value={profile?.[key]}
                  activeField={activeField}
                  setActiveField={setActiveField}
                  onSave={updateField}
                />
              ))}
            </Card>
          </div>

          {/* ── Account info (read-only) ── */}
          <Card>
            <h2 className="text-sm font-headline font-bold mb-4 gradient-text">
              {t('profile.account.title')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              {[
                { label: t('profile.account.email'),     value: user.email },
                { label: t('profile.account.provider'),  value: <ProviderBadge provider={provider} /> },
                { label: t('profile.account.createdAt'), value: formatDate(user.created_at) },
                { label: t('profile.account.lastLogin'), value: formatDate(user.last_sign_in_at) },
              ].map(({ label, value }) => (
                <div key={label} className="py-3.5 border-b border-white/5 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-wider mb-1" style={{ color: '#55545b' }}>
                    {label}
                  </p>
                  {typeof value === 'string'
                    ? <p className="text-sm text-on-surface">{value}</p>
                    : value
                  }
                </div>
              ))}
            </div>
          </Card>

        </motion.div>
      </main>
    </>
  )
}
