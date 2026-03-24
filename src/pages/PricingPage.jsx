// src/pages/PricingPage.jsx
import { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'
import PricingTeaser from '../components/PricingTeaser'
import PricingFAQ from '../components/PricingFAQ'

const PricingCalculator = lazy(() => import('../components/PricingCalculator'))

export default function PricingPage() {
  const { t } = useLanguage()

  return (
    <>
      <Helmet>
        <title>{t('pricingPage.seoTitle')}</title>
        <meta name="description" content={t('pricingPage.seoDescription')} />
        <link rel="canonical" href={t('pricingPage.seoCanonical')} />
        <meta property="og:title" content={t('pricingPage.seoTitle')} />
        <meta property="og:description" content={t('pricingPage.seoDescription')} />
        <meta property="og:url" content={t('pricingPage.seoCanonical')} />
        <meta name="twitter:title" content={t('pricingPage.seoTitle')} />
        <meta name="twitter:description" content={t('pricingPage.seoDescription')} />
      </Helmet>
      <main id="main-content" className="relative z-10 pt-20">
        <PricingTeaser scrollLock={false} ctaTarget="#calculator" />
        <Suspense fallback={null}><PricingCalculator /></Suspense>
        <PricingFAQ />
      </main>
    </>
  )
}
