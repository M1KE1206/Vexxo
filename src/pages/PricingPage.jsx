// src/pages/PricingPage.jsx
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'
import { SEO } from '../config/seo'
import PricingTeaser from '../components/PricingTeaser'
import PricingCalculator from '../components/PricingCalculator'
import PricingFAQ from '../components/PricingFAQ'

export default function PricingPage() {
  const { t } = useLanguage()

  return (
    <>
      <Helmet>
        <title>{t('pricingPage.seoTitle')}</title>
        <meta name="description" content={t('pricingPage.seoDescription')} />
        <link rel="canonical" href={t('pricingPage.seoCanonical')} />
        <meta property="og:title" content={t('pricingPage.seoTitle')} />
        <meta property="og:url" content={t('pricingPage.seoCanonical')} />
      </Helmet>
      <main id="main-content" className="relative z-10 pt-20">
        <PricingTeaser scrollLock={false} ctaTarget="#calculator" />
        <PricingCalculator />
        <PricingFAQ />
      </main>
    </>
  )
}
