import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { ModalProvider, useModal } from './context/ModalContext'
import { AuthProvider, _registerDispatch } from './context/AuthContext'
import { SEO } from './config/seo'
import StructuredData from './components/StructuredData'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HashScrollHandler from './components/HashScrollHandler'
import HomePage from './pages/HomePage'
const PricingPage = lazy(() => import('./pages/PricingPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

const ServiceRequestModal = lazy(() => import('./components/ServiceRequestModal'))
const AuthModal           = lazy(() => import('./components/AuthModal'))

/** Homepage SEO — taal-aware, leeft binnen LanguageProvider */
function SeoHead() {
  const { lang, t } = useLanguage()
  const isNL = lang === 'nl'
  return (
    <Helmet>
      <html lang={isNL ? 'nl-BE' : 'en-GB'} />
      <title>{t('seo.title')}</title>
      <meta name="description"  content={t('seo.description')} />
      <meta name="keywords"     content={SEO.keywords} />
      <meta name="author"       content={SEO.siteName} />
      <link rel="canonical"     href={SEO.siteUrl} />
      <meta name="robots"       content="index, follow" />
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={SEO.siteUrl} />
      <meta property="og:title"       content={t('seo.title')} />
      <meta property="og:description" content={t('seo.description')} />
      <meta property="og:image"       content={`${SEO.siteUrl}/og-image.png`} />
      <meta property="og:locale"      content={isNL ? SEO.locale : SEO.localeAlt} />
      <meta property="og:site_name"   content={SEO.siteName} />
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={SEO.twitterHandle} />
      <meta name="twitter:title"       content={t('seo.title')} />
      <meta name="twitter:description" content={t('seo.description')} />
      <meta name="twitter:image"       content={`${SEO.siteUrl}/og-image.png`} />
      <link rel="alternate" hreflang="nl" href={`${SEO.siteUrl}/?lang=nl`} />
      <link rel="alternate" hreflang="en" href={`${SEO.siteUrl}/?lang=en`} />
      <link rel="alternate" hreflang="x-default" href={SEO.siteUrl} />
    </Helmet>
  )
}

/**
 * AppDispatcher: registreert de ModalContext dispatch-functie in AuthContext.
 * Zorgt dat requireAuth() na OAuth-redirect de ServiceModal kan openen.
 * NIET VERWIJDEREN — zonder dit werkt de pendingAction flow niet na page reload.
 */
function AppDispatcher() {
  const { openModal } = useModal()
  useEffect(() => {
    _registerDispatch((payload) => {
      if (payload?.action === 'openServiceModal') openModal(payload.data ?? null)
    })
    return () => _registerDispatch(null)
  }, [openModal])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <ModalProvider>
                <AppDispatcher />
                <HashScrollHandler />
                <SeoHead />
                <StructuredData />

                <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30">
                  <div className="page-content">
                    <Navbar />
                    <Routes>
                      <Route path="/"        element={<HomePage />} />
                      <Route path="/prijzen" element={<Suspense fallback={null}><PricingPage /></Suspense>} />
                      <Route path="/profiel" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><ProfilePage /></Suspense>} />
                    </Routes>
                    <Footer />
                    <ScrollToTop />
                  </div>

                  <Suspense fallback={null}><ServiceRequestModal /></Suspense>
                  <Suspense fallback={null}><AuthModal /></Suspense>
                </div>
              </ModalProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  )
}
