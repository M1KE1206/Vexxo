// src/components/PricingSection.jsx
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { packages, serviceCategories } from '../config/services'
import { addOns } from '../config/pricing'

// ── SVG icon map (outline only) ──────────────────────────────
const ICONS = {
  brush: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13.5V19a2 2 0 002 2h5.5M22 6l-4-4-9 9v4h4l9-9z"/>
      <path d="M14 4l4 4"/>
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="8" cy="14" r="1.5"/>
      <circle cx="10" cy="9" r="1.5"/>
      <circle cx="15" cy="9" r="1.5"/>
      <circle cx="16.5" cy="14" r="1.5"/>
    </svg>
  ),
  design_services: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  photo_camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1"/>
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  manage_search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  rocket_launch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
    </svg>
  ),
  trending_up: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 9 18 21 6 21 2 9 12 2"/>
    </svg>
  ),
  build: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
}

// ── Security-aware validation ─────────────────────────────────
const SQL_RE       = /(\b(select|insert|update|delete|drop|union|exec|script|alert|eval|where|from|having|cast|convert|declare|xp_)\b|--|;|\/\*|\*\/|<[^>]*>)/i
const SAFE_NAME    = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'\-.]{2,60}$/
const SAFE_COMPANY = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s'\-.&,]{1,80}$/
const SAFE_TEL     = /^[\+\d\s\-()]{8,20}$/
const EMAIL_RE     = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

function makeValidators(t) {
  return {
    naam: (v) => {
      if (!v) return null
      if (v.length < 2) return t('pricingSection.errNaamShort')
      if (SQL_RE.test(v)) return t('pricingSection.errInjection')
      if (!SAFE_NAME.test(v)) return t('pricingSection.errNaamChars')
      return true
    },
    bedrijf: (v) => {
      if (!v) return null
      if (SQL_RE.test(v)) return t('pricingSection.errInjection')
      if (!SAFE_COMPANY.test(v)) return t('pricingSection.errBedrijfChars')
      return true
    },
    email: (v) => {
      if (!v) return null
      if (SQL_RE.test(v)) return t('pricingSection.errInjection')
      if (!EMAIL_RE.test(v)) return t('pricingSection.errEmailInvalid')
      if (v.length > 120) return t('pricingSection.errEmailLong')
      return true
    },
    tel: (v) => {
      if (!v) return null
      if (/[a-zA-Z]/.test(v)) return t('pricingSection.errTelLetters')
      if (!SAFE_TEL.test(v)) return t('pricingSection.errTelChars')
      if (v.replace(/\D/g, '').length < 8) return t('pricingSection.errTelShort')
      return true
    },
    notes: (v) => {
      if (!v) return null
      if (SQL_RE.test(v)) return t('pricingSection.errInjection')
      if (v.length < 10) return t('pricingSection.errNotesShort')
      if (v.length > 1000) return t('pricingSection.errNotesLong')
      return true
    },
  }
}

// ── Field validation icon (check/cross) ──────────────────────
function FieldIcon({ state }) {
  if (!state) return null
  const isValid = state === 'valid'
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="absolute right-[11px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full flex items-center justify-center pointer-events-none"
      style={{ background: isValid ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)' }}
    >
      <svg viewBox="0 0 24 24" className="w-[9px] h-[9px]" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {isValid
          ? <polyline points="20 6 9 17 4 12"/>
          : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
        }
      </svg>
    </motion.div>
  )
}

function TextareaIcon({ state }) {
  if (!state) return null
  const isValid = state === 'valid'
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="absolute right-[11px] bottom-[11px] w-[18px] h-[18px] rounded-full flex items-center justify-center pointer-events-none"
      style={{ background: isValid ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)' }}
    >
      <svg viewBox="0 0 24 24" className="w-[9px] h-[9px]" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {isValid
          ? <polyline points="20 6 9 17 4 12"/>
          : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
        }
      </svg>
    </motion.div>
  )
}

// ── Reusable glass block wrapper ──────────────────────────────
function Block({ children }) {
  return (
    <div
      className="rounded-[20px] p-6"
      style={{
        background: 'rgba(18,15,32,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(124,58,237,0.18)',
      }}
    >
      {children}
    </div>
  )
}

function StepLabel({ num, text }) {
  return (
    <div className="flex items-center gap-[10px] text-[10px] font-bold tracking-[0.16em] uppercase mb-[18px]" style={{ color: 'var(--color-text-muted)' }}>
      <span
        className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#7C3AED,#F97316)' }}
      >
        {num}
      </span>
      {text}
    </div>
  )
}

// ── Service card ──────────────────────────────────────────────
function ServiceCard({ pkg, lang, selected, onSelect, animDelay }) {
  const icon = ICONS[pkg.icon] || ICONS.code
  const name = lang === 'nl' ? pkg.nameNL : pkg.name
  const desc = lang === 'nl' ? pkg.descriptionNL : pkg.description

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: selected ? -2 : 0, scale: 1 }}
      transition={{ duration: 0.35, delay: animDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={selected ? {} : { y: -4, scale: 1.005 }}
      onClick={onSelect}
      className="rounded-[12px] p-[18px] cursor-pointer relative overflow-hidden"
      style={selected ? {
        background: 'linear-gradient(rgba(13,10,26,1),rgba(13,10,26,1)) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box',
        border: '1.5px solid transparent',
        boxShadow: '0 0 32px rgba(124,58,237,0.18),inset 0 0 20px rgba(124,58,237,0.04)',
      } : {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[12px]"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.06) 0%,rgba(249,115,22,0.03) 100%)' }}
        />
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="absolute top-[11px] right-[11px] w-[20px] h-[20px] rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#F97316)' }}
          >
            <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center mb-3"
        style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)', color: '#C084FC' }}
      >
        <div className="w-[16px] h-[16px]">{icon}</div>
      </div>

      <h4 className="text-[13px] font-bold mb-1" style={{ color: '#C084FC' }}>{name}</h4>
      <p className="text-[11px] leading-[1.5] mb-3" style={{ color: 'var(--color-text-faint)' }}>{desc}</p>
      <div className="text-[16px] font-extrabold" style={{ fontFamily: 'Manrope, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
        €{pkg.price.toLocaleString('nl-BE')}
        {pkg.priceNote && <span className="text-[10px] font-normal ml-[2px]" style={{ color: 'var(--color-text-faint)' }}>{pkg.priceNote}</span>}
      </div>
    </motion.div>
  )
}

// ── Field label wrapper ───────────────────────────────────────
function FieldLabel({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--color-text-faint)' }}>
        {label}
        {required && <span className="ml-[2px]" style={{ color: 'var(--color-secondary)' }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[10px] px-[2px]" style={{ color: 'rgba(239,68,68,0.9)' }}>{error}</p>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function PricingSection() {
  const { t, lang } = useLanguage()

  const [selCat, setSelCat] = useState(null)
  const [selPkg, setSelPkg] = useState(null)
  const [pages, setPages] = useState(5)
  const [seoOn, setSeoOn] = useState(false)

  const [form, setForm] = useState({ naam: '', bedrijf: '', email: '', tel: '', notes: '' })
  const [touched, setTouched] = useState({})

  const telRef = useRef(null)

  useEffect(() => {
    const el = telRef.current
    if (!el) return
    const handler = (e) => {
      const allowed = /[\d+\s\-()]/
      if (!allowed.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
    }
    el.addEventListener('keypress', handler)
    return () => el.removeEventListener('keypress', handler)
  }, [])

  const validators = makeValidators(t)

  function getFieldState(key) {
    const val = form[key]
    if (!touched[key] && !val) return null
    const result = validators[key](val)
    if (result === null) return null
    return result === true ? 'valid' : 'invalid'
  }

  function getFieldError(key) {
    if (!touched[key]) return null
    const result = validators[key](form[key])
    return typeof result === 'string' ? result : null
  }

  const handleInput = useCallback((key, value) => {
    setForm(f => ({ ...f, [key]: value }))
  }, [])

  const handleBlur = useCallback((key) => {
    setTouched(t => ({ ...t, [key]: true }))
  }, [])

  function selectCat(catId) {
    setSelCat(catId)
    setSelPkg(null)
    setSeoOn(false)
  }

  function selectPkg(pkg) {
    setSelPkg(pkg)
    setSeoOn(false)
  }

  const EXTRA_PPP = 60

  function calcPrice() {
    if (!selPkg) return null
    if (selPkg.included > 0) {
      const extra = Math.max(0, pages - selPkg.included)
      return selPkg.price + extra * EXTRA_PPP + (seoOn ? pages * addOns.seo.perPage : 0)
    }
    return selPkg.price
  }

  const price = calcPrice()
  const extraPages = selPkg?.included > 0 ? Math.max(0, pages - selPkg.included) : 0
  const sliderPct = ((pages - 1) / 29) * 100
  const catPackages = selCat ? packages[selCat] : []
  const showSlider = selPkg?.included > 0
  const showAddons = selPkg?.hasSeo
  const formStep = showAddons ? 3 : 2

  const inputBase = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '11px 38px 11px 14px',
    fontSize: '13px',
    color: 'var(--color-text)',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  }

  function getInputStyle(key) {
    const state = getFieldState(key)
    if (state === 'valid') return { ...inputBase, borderColor: 'rgba(34,197,94,0.45)' }
    if (state === 'invalid') return { ...inputBase, borderColor: 'rgba(239,68,68,0.5)' }
    return inputBase
  }

  return (
    <section className="py-24 px-8 relative">
      {/* Ambient glows */}
      <div
        className="pointer-events-none fixed rounded-full z-0"
        style={{ width: 700, height: 700, top: -250, left: -150, background: 'radial-gradient(circle,rgba(124,58,237,0.11) 0%,transparent 68%)' }}
      />
      <div
        className="pointer-events-none fixed rounded-full z-0"
        style={{ width: 550, height: 550, bottom: -120, right: -100, background: 'radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 68%)' }}
      />

      <div className="max-w-[1120px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-[560px] mx-auto mb-[52px]">
          <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase mb-[14px]" style={{ color: 'var(--color-secondary)' }}>
            {t('pricingSection.badge')}
          </span>
          <h2
            className="font-extrabold leading-[1.08] mb-[14px]"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(28px,4vw,42px)',
              background: 'linear-gradient(135deg,#7C3AED 0%,#F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('pricingSection.title')}
          </h2>
          <p className="text-[15px] leading-[1.65]" style={{ color: 'var(--color-text-muted)' }}>
            {t('pricingSection.subtitle')}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
          <div className="flex flex-col gap-4">

            {/* Block 1: Category tabs + service cards */}
            <Block>
              <StepLabel num="1" text={t('pricingSection.step1Label')} />

              {/* Category tabs */}
              <div
                className="grid grid-cols-3 gap-2 p-[6px] rounded-[14px] mb-4"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {serviceCategories.map(cat => {
                  const active = selCat === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => selectCat(cat.id)}
                      className="py-3 px-2 text-center rounded-[10px] text-[13px] font-bold cursor-pointer transition-all duration-[250ms]"
                      style={{
                        color: active ? 'var(--color-text)' : 'var(--color-text-faint)',
                        background: active ? 'rgba(124,58,237,0.14)' : 'transparent',
                        border: active ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
                        boxShadow: active ? '0 0 20px rgba(124,58,237,0.1)' : 'none',
                      }}
                    >
                      {lang === 'nl' ? cat.labelNL : cat.labelEN}
                    </button>
                  )
                })}
              </div>

              {/* Empty state */}
              {!selCat && (
                <div className="text-center py-9 px-5">
                  <div
                    className="w-[52px] h-[52px] rounded-full flex items-center justify-center mx-auto mb-[14px]"
                    style={{ background: 'rgba(124,58,237,0.07)', border: '1px dashed rgba(124,58,237,0.22)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="var(--color-text-faint)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <rect x="14" y="14" width="7" height="7" rx="1"/>
                    </svg>
                  </div>
                  <strong className="block text-[14px] mb-[6px]" style={{ color: 'var(--color-text-muted)' }}>
                    {t('pricingSection.emptyTitle')}
                  </strong>
                  <p className="text-[12px] leading-[1.6]" style={{ color: 'var(--color-text-faint)' }}>
                    {t('pricingSection.emptyText')}
                  </p>
                </div>
              )}

              {/* Service cards */}
              {selCat && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selCat}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-3 mt-4"
                  >
                    {catPackages.map((pkg, i) => (
                      <ServiceCard
                        key={pkg.id}
                        pkg={pkg}
                        lang={lang}
                        selected={selPkg?.id === pkg.id}
                        onSelect={() => selectPkg(pkg)}
                        animDelay={0.04 + i * 0.065}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Inline page slider — only for multi-page services */}
              <AnimatePresence>
                {showSlider && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: 'var(--color-text-muted)' }}>
                          {t('pricingSection.sliderLabel')}
                        </span>
                        <span>
                          <span className="text-[13px] font-bold" style={{ color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                            {pages} pagina{pages === 1 ? '' : "'s"}
                          </span>
                          <span
                            className="text-[11px] ml-[6px]"
                            style={{ color: extraPages > 0 ? 'var(--color-secondary)' : 'var(--color-text-faint)' }}
                          >
                            {extraPages > 0 ? `· +${extraPages} extra` : t('pricingSection.sliderIncluded')}
                          </span>
                        </span>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={pages}
                        onChange={e => setPages(Number(e.target.value))}
                        className="pricing-slider w-full h-[5px] rounded-[3px] outline-none cursor-pointer appearance-none"
                        style={{
                          background: `linear-gradient(to right,#7C3AED ${sliderPct}%,rgba(255,255,255,0.08) ${sliderPct}%)`,
                        }}
                      />

                      <div className="flex justify-between text-[10px] mt-[6px]" style={{ color: 'var(--color-text-faint)' }}>
                        <span>1</span>
                        <span>{selPkg.included} (inbegrepen)</span>
                        <span>30</span>
                      </div>

                      <AnimatePresence>
                        {extraPages > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="inline-flex items-center gap-[6px] mt-[10px] px-3 py-[7px] rounded-[20px] text-[11px] font-semibold"
                            style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: 'var(--color-secondary)' }}
                          >
                            <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {extraPages} extra × €{EXTRA_PPP} = +€{(extraPages * EXTRA_PPP).toLocaleString('nl-BE')}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Block>

            {/* Block 2: SEO add-on (only when hasSeo) */}
            <AnimatePresence>
              {showAddons && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <Block>
                    <StepLabel num="2" text={t('pricingSection.step2Label')} />
                    <button
                      onClick={() => setSeoOn(v => !v)}
                      className="flex items-center gap-[14px] w-full p-[14px] rounded-[12px] cursor-pointer text-left transition-all duration-200"
                      style={seoOn ? {
                        background: 'linear-gradient(rgba(14,11,28,1),rgba(14,11,28,1)) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box',
                        border: '1px solid transparent',
                        boxShadow: '0 0 20px rgba(124,58,237,0.12),inset 0 0 16px rgba(124,58,237,0.04)',
                      } : {
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {/* Toggle knob */}
                      <div
                        className="w-[38px] h-[22px] rounded-[11px] relative flex-shrink-0 transition-all duration-200"
                        style={{
                          background: seoOn ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)',
                          border: seoOn ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: seoOn ? '0 0 10px rgba(124,58,237,0.3)' : 'none',
                        }}
                      >
                        <motion.div
                          animate={{ left: seoOn ? 18 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white"
                          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>
                          {t('pricingSection.seoAddonName')}
                        </div>
                        <div className="text-[11px] mt-[2px]" style={{ color: 'var(--color-text-faint)' }}>
                          {t('pricingSection.seoAddonDesc')}
                        </div>
                      </div>
                      <div className="text-[11px] font-bold whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                        {t('pricingSection.seoAddonPrice')}
                      </div>
                    </button>
                  </Block>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Block 3/2: Contact form */}
            <Block>
              <StepLabel num={formStep} text={t('pricingSection.stepFormLabel')} />

              <div className="grid grid-cols-2 gap-3">

                <FieldLabel label={t('pricingSection.fieldNaam')} required error={getFieldError('naam')}>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.naam}
                      placeholder={t('pricingSection.placeholderNaam')}
                      autoComplete="name"
                      maxLength={60}
                      onChange={e => handleInput('naam', e.target.value)}
                      onBlur={() => handleBlur('naam')}
                      style={getInputStyle('naam')}
                    />
                    <AnimatePresence mode="wait">
                      {getFieldState('naam') && <FieldIcon key={getFieldState('naam')} state={getFieldState('naam')} />}
                    </AnimatePresence>
                  </div>
                </FieldLabel>

                <FieldLabel label={t('pricingSection.fieldBedrijf')} error={getFieldError('bedrijf')}>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.bedrijf}
                      placeholder={t('pricingSection.placeholderBedrijf')}
                      autoComplete="organization"
                      maxLength={80}
                      onChange={e => handleInput('bedrijf', e.target.value)}
                      onBlur={() => handleBlur('bedrijf')}
                      style={getInputStyle('bedrijf')}
                    />
                    <AnimatePresence mode="wait">
                      {getFieldState('bedrijf') && <FieldIcon key={getFieldState('bedrijf')} state={getFieldState('bedrijf')} />}
                    </AnimatePresence>
                  </div>
                </FieldLabel>

                <FieldLabel label={t('pricingSection.fieldEmail')} required error={getFieldError('email')}>
                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      placeholder={t('pricingSection.placeholderEmail')}
                      autoComplete="email"
                      maxLength={120}
                      onChange={e => handleInput('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      style={getInputStyle('email')}
                    />
                    <AnimatePresence mode="wait">
                      {getFieldState('email') && <FieldIcon key={getFieldState('email')} state={getFieldState('email')} />}
                    </AnimatePresence>
                  </div>
                </FieldLabel>

                <FieldLabel label={t('pricingSection.fieldTel')} error={getFieldError('tel')}>
                  <div className="relative">
                    <input
                      ref={telRef}
                      type="tel"
                      value={form.tel}
                      placeholder={t('pricingSection.placeholderTel')}
                      autoComplete="tel"
                      maxLength={20}
                      onChange={e => handleInput('tel', e.target.value)}
                      onBlur={() => handleBlur('tel')}
                      style={getInputStyle('tel')}
                    />
                    <AnimatePresence mode="wait">
                      {getFieldState('tel') && <FieldIcon key={getFieldState('tel')} state={getFieldState('tel')} />}
                    </AnimatePresence>
                  </div>
                </FieldLabel>

                <div className="col-span-2">
                  <FieldLabel label={t('pricingSection.fieldNotes')} error={getFieldError('notes')}>
                    <div className="relative">
                      <textarea
                        value={form.notes}
                        placeholder={t('pricingSection.placeholderNotes')}
                        rows={3}
                        maxLength={1000}
                        onChange={e => handleInput('notes', e.target.value)}
                        onBlur={() => handleBlur('notes')}
                        style={{
                          ...inputBase,
                          padding: '11px 14px',
                          resize: 'none',
                          ...(getFieldState('notes') === 'valid' && { borderColor: 'rgba(34,197,94,0.45)' }),
                          ...(getFieldState('notes') === 'invalid' && { borderColor: 'rgba(239,68,68,0.5)' }),
                        }}
                      />
                      <AnimatePresence mode="wait">
                        {getFieldState('notes') && <TextareaIcon key={getFieldState('notes')} state={getFieldState('notes')} />}
                      </AnimatePresence>
                    </div>
                  </FieldLabel>
                </div>

              </div>
            </Block>

          </div>

          {/* Sticky sidebar */}
          <div className="sticky top-6">
            <div
              className="rounded-[20px] p-[26px]"
              style={{
                background: 'linear-gradient(160deg,rgba(18,13,38,.88),rgba(10,9,22,.94))',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(124,58,237,0.22)',
                boxShadow: '0 0 50px rgba(124,58,237,0.07),inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <h3 className="text-[17px] font-extrabold mb-[22px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {t('pricingSection.sidebarTitle')}
              </h3>

              <AnimatePresence mode="wait">
                {!selPkg ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-7 px-3"
                  >
                    <div
                      className="w-[46px] h-[46px] rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(124,58,237,0.07)', border: '1px dashed rgba(124,58,237,0.2)' }}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="var(--color-text-faint)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <p className="text-[12px] leading-[1.6]" style={{ color: 'var(--color-text-faint)' }}>
                      {t('pricingSection.sidebarEmptyText')}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex justify-between items-center py-[7px]">
                      <span className="text-[11px]" style={{ color: 'var(--color-text-faint)' }}>{t('pricingSection.sidebarCat')}</span>
                      <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text)' }}>
                        {serviceCategories.find(c => c.id === selCat)?.[lang === 'nl' ? 'labelNL' : 'labelEN']}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-[7px]">
                      <span className="text-[11px]" style={{ color: 'var(--color-text-faint)' }}>{t('pricingSection.sidebarSvc')}</span>
                      <span className="text-[12px] font-semibold" style={{ color: '#C084FC' }}>
                        {lang === 'nl' ? selPkg.nameNL : selPkg.name}
                      </span>
                    </div>
                    {selPkg.included > 0 && (
                      <div className="flex justify-between items-center py-[7px]">
                        <span className="text-[11px]" style={{ color: 'var(--color-text-faint)' }}>{t('pricingSection.sidebarPages')}</span>
                        <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text)' }}>{pages} pagina's</span>
                      </div>
                    )}
                    {seoOn && selPkg.hasSeo && (
                      <div className="flex justify-between items-center py-[7px]">
                        <span className="text-[11px]" style={{ color: 'var(--color-text-faint)' }}>{t('pricingSection.sidebarSeo')}</span>
                        <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text)' }}>+€30/pag.</span>
                      </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '14px 0' }} />

                    <ul className="list-none mb-5">
                      {(lang === 'nl' ? selPkg.features.nl : selPkg.features.en).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] py-1 leading-[1.4]" style={{ color: 'var(--color-text-muted)' }}>
                          <span
                            className="w-[14px] h-[14px] rounded-full flex items-center justify-center flex-shrink-0 mt-[1px]"
                            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.28)' }}
                          >
                            <svg viewBox="0 0 24 24" className="w-2 h-2" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '14px 0' }} />

                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
                          {t('pricingSection.sidebarTotal')}
                        </span>
                        <small className="block text-[10px]" style={{ color: 'var(--color-text-faint)' }}>
                          {t('pricingSection.sidebarNote')}
                        </small>
                      </div>
                      <span className="text-[36px] font-black leading-none" style={{ fontFamily: 'Manrope, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                        €{price?.toLocaleString('nl-BE')}{selPkg.priceNote || ''}
                      </span>
                    </div>

                    <button
                      className="flex items-center justify-center gap-2 w-full py-[15px] rounded-[12px] text-[14px] font-bold text-white cursor-pointer mb-3 transition-opacity duration-150 hover:opacity-90 active:scale-[0.98]"
                      style={{
                        background: 'linear-gradient(to right,#7C3AED,#F97316)',
                        border: 'none',
                        boxShadow: '0 4px 24px rgba(124,58,237,0.28)',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {t('pricingSection.ctaLabel')}
                      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] flex-shrink-0" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>

                    <div
                      className="flex items-center gap-2 p-[10px] rounded-[10px] mb-[14px]"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] flex-shrink-0" fill="none" stroke="var(--color-text-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <span className="text-[11px] leading-[1.4]" style={{ color: 'var(--color-text-faint)' }}>
                        {t('pricingSection.trustText')}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social proof */}
              <div className="flex items-center gap-[10px] pt-[14px]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex">
                  {[
                    { l: 'M', bg: '#7C3AED' },
                    { l: 'A', bg: '#F97316' },
                    { l: 'J', bg: '#6d28d9' },
                  ].map((av, i) => (
                    <div
                      key={i}
                      className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: av.bg, border: '2px solid #07070d', marginRight: '-7px' }}
                    >
                      {av.l}
                    </div>
                  ))}
                  <div
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{ background: '#1a1a2e', color: '#acaab1', border: '2px solid #07070d', marginRight: '-7px' }}
                  >
                    +12
                  </div>
                </div>
                <p className="text-[11px] leading-[1.4] flex-1 pl-[14px]" style={{ color: 'var(--color-text-faint)' }}>
                  {t('pricingSection.socialProof')}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
