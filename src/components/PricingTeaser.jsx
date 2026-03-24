// src/components/PricingTeaser.jsx
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { vexxo, comparison } from '../config/pricing'

const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

/**
 * Prijsteaser met scroll-locked card reveal.
 *
 * Props:
 *   scrollLock  — boolean, default true. False op /prijzen (bovenaan pagina).
 *   ctaTarget   — string, default "/prijzen". "#calculator" scrollt naar sectie op zelfde pagina.
 */
export default function PricingTeaser({ scrollLock = true, ctaTarget = '/prijzen' }) {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const [step, setStep] = useState(0) // 0=hidden, 1=vexxo, 2=+freelancer, 3=+agency
  const stepRef = useRef(0)

  const touch = isTouch()
  const doLock = scrollLock && !touch

  // ── Scroll-lock reveal (desktop, homepage only) ──
  useEffect(() => {
    if (!doLock) return // !doLock uses whileInView in JSX

    let locked = false
    let savedY = 0
    let delta = 0
    const THRESHOLD = 80    // px scroll per stap
    const COOLDOWN = 500    // ms minimum tussen stappen (voorkomt rapid-fire bij momentum scroll)
    let lastAdvanceTime = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && stepRef.current < 1) {
          lock()
        }
      },
      { threshold: 0.4 }
    )

    function lock() {
      if (locked) return
      locked = true
      savedY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${savedY}px`
      document.body.style.width = '100%'
      delta = 0
      stepRef.current = 1
      setStep(1)
      lastAdvanceTime = Date.now()
      window.addEventListener('wheel', onWheel, { passive: false })
    }

    function unlock() {
      locked = false
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, savedY)
      window.removeEventListener('wheel', onWheel)
    }

    function advance() {
      const now = Date.now()
      if (now - lastAdvanceTime < COOLDOWN) return
      lastAdvanceTime = now
      stepRef.current += 1
      setStep(stepRef.current)
      delta = 0
      if (stepRef.current >= 3) {
        setTimeout(unlock, 300)
      }
    }

    function onWheel(e) {
      e.preventDefault()
      delta += e.deltaY
      if (delta > THRESHOLD && stepRef.current < 3) {
        advance()
      }
    }

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
      if (locked) unlock()
    }
  }, [doLock])

  function handleCta() {
    if (ctaTarget.startsWith('#')) {
      const el = document.querySelector(ctaTarget)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(ctaTarget)
    }
  }

  const cardBase = {
    background: '#0e0e13',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '28px 24px',
    fontFamily: 'Inter, sans-serif',
  }

  const gradientBorder = {
    background: 'linear-gradient(#0e0e13,#0e0e13) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box',
    border: '1px solid transparent',
    borderRadius: '14px',
    padding: '32px 28px',
  }

  const labelStyle = { fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '20px', display: 'block' }
  const priceStyle = { fontSize: '32px', fontWeight: 800, color: '#f9f5fd', lineHeight: 1 }
  const perPageStyle = { fontSize: '12px', color: '#55545b', marginTop: '4px', marginBottom: '24px' }
  const divider = { width: '24px', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0 20px' }
  const featureStyle = { fontSize: '12px', color: '#acaab1' }

  const ease = [0.25, 0.46, 0.45, 0.94]

  // Motion props: scroll-lock (doLock) vs whileInView (!doLock)
  const freelancerMotion = doLock
    ? {
        initial: { opacity: 0, x: -60 },
        animate: step >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 },
        transition: { duration: 0.5, ease },
      }
    : {
        initial: { opacity: 0, x: -60 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, ease, delay: 0.15 },
      }

  const vexxoMotion = doLock
    ? {
        initial: { opacity: 0, y: 40 },
        animate: step >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
        transition: { duration: 0.5, ease },
      }
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, ease },
      }

  const agencyMotion = doLock
    ? {
        initial: { opacity: 0, x: 60 },
        animate: step >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 },
        transition: { duration: 0.5, ease },
      }
    : {
        initial: { opacity: 0, x: 60 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, ease, delay: 0.3 },
      }

  return (
    <section ref={sectionRef} id="pricing-teaser" className="py-24 px-8">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="section-label">{t('pricing.badge')}</span>
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">
          {t('pricing.title')}
        </h2>
        <p className="text-on-surface-variant mt-3">{t('pricing.subtitle')}</p>
      </div>

      <div className="max-w-3xl mx-auto flex items-center justify-center gap-6">

        {/* Freelancer — links, tilt -5deg */}
        <motion.div
          {...freelancerMotion}
          style={{ ...cardBase, transform: 'rotate(-5deg)', flexShrink: 0, width: '200px' }}
        >
          <span style={{ ...labelStyle, color: '#55545b' }}>
            {lang === 'nl' ? comparison.freelancer.labelNL : comparison.freelancer.labelEN}
          </span>
          <div style={{ ...priceStyle, fontSize: '28px' }}>€{comparison.freelancer.base.toLocaleString()}</div>
          <div style={perPageStyle}>+ €{comparison.freelancer.perPage} / {t('pricing.perPageLabel')}</div>
          <div style={divider} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={featureStyle}>{t('pricing.teaser.standardDesign')}</div>
            <div style={featureStyle}>{t('pricing.teaser.basicSeo')}</div>
            <div style={featureStyle}>{t('pricing.teaser.weeks4to6')}</div>
          </div>
        </motion.div>

        {/* Vexxo — midden, recht, gradient border */}
        <motion.div
          {...vexxoMotion}
          style={{ ...gradientBorder, flexShrink: 0, width: '220px', position: 'relative', zIndex: 2 }}
        >
          <span style={{ ...labelStyle, color: '#7C3AED' }}>Vexxo Studio</span>
          <div style={priceStyle}>€{vexxo.base.toLocaleString()}</div>
          <div style={perPageStyle}>+ €{vexxo.perPage} / {t('pricing.perPageLabel')}</div>
          <div style={divider} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            <div style={featureStyle}>{t('pricing.teaser.premiumDesign')}</div>
            <div style={featureStyle}>{t('pricing.teaser.fullSeo')}</div>
            <div style={featureStyle}>{t('pricing.teaser.weeks1to2')}</div>
          </div>
          {/* CTA knop — geen btn-primary om hover-scale te vermijden */}
          <button
            onClick={handleCta}
            className="w-full text-sm py-2.5 group flex items-center justify-center gap-0 rounded-full font-bold tracking-wide transition-opacity duration-150 hover:opacity-90 active:opacity-75"
            style={{ background: 'linear-gradient(to right, #7C3AED, #F97316)', color: 'white' }}
          >
            <span>{t('pricing.teaser.cta')}</span>
            <span className="opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-1.5 transition-all duration-200 ml-0 text-xs">↗</span>
          </button>
        </motion.div>

        {/* Agency — rechts, tilt +5deg */}
        <motion.div
          {...agencyMotion}
          style={{ ...cardBase, transform: 'rotate(5deg)', flexShrink: 0, width: '200px' }}
        >
          <span style={{ ...labelStyle, color: '#55545b' }}>
            {lang === 'nl' ? comparison.agency.labelNL : comparison.agency.labelEN}
          </span>
          <div style={{ ...priceStyle, fontSize: '28px' }}>€{comparison.agency.base.toLocaleString()}</div>
          <div style={perPageStyle}>+ €{comparison.agency.perPage} / {t('pricing.perPageLabel')}</div>
          <div style={divider} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={featureStyle}>{t('pricing.teaser.enterpriseDesign')}</div>
            <div style={featureStyle}>{t('pricing.teaser.dedicatedTeam')}</div>
            <div style={featureStyle}>{t('pricing.teaser.weeks8to12')}</div>
          </div>
        </motion.div>

      </div>

      {/* Link naar /prijzen (alleen op homepage) */}
      {ctaTarget !== '#calculator' && (
        <div className="text-center mt-10">
          <button onClick={handleCta} className="text-sm text-on-surface-variant hover:text-on-surface transition-colors group flex items-center gap-1 mx-auto">
            {t('pricing.teaser.viewAll')}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
          </button>
        </div>
      )}
    </section>
  )
}
