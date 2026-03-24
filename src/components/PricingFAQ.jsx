// src/components/PricingFAQ.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const FAQ_KEYS = ['1', '2', '3', '4', '5']

export default function PricingFAQ() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="py-24 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">{t('faq.badge')}</span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">
            {t('faq.title')}
          </h2>
          <p className="text-on-surface-variant mt-3">{t('faq.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ_KEYS.map((k) => (
            <div
              key={k}
              style={
                open === k
                  ? {
                      background: 'linear-gradient(#0e0e13,#0e0e13) padding-box, linear-gradient(135deg,#7C3AED,#F97316) border-box',
                      border: '1px solid transparent',
                      borderRadius: '12px',
                    }
                  : {
                      background: '#0e0e13',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                    }
              }
            >
              <button
                onClick={() => setOpen(open === k ? null : k)}
                className="w-full flex justify-between items-center px-6 py-5 text-left"
                aria-expanded={open === k}
              >
                <span className="text-sm font-bold text-on-surface">{t(`faq.q${k}`)}</span>
                <span
                  className="text-on-surface-variant ml-4 flex-shrink-0 transition-transform duration-200"
                  style={{ transform: open === k ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === k && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="px-6 pb-5 text-sm text-on-surface-variant leading-relaxed">
                      {t(`faq.a${k}`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
