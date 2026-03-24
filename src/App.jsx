import { lazy, Suspense, useEffect } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { LanguageProvider } from "./context/LanguageContext";
import { ModalProvider } from "./context/ModalContext";
import { useLanguage } from "./context/LanguageContext";
import { useModal } from "./context/ModalContext";
import { AuthProvider, _registerDispatch } from "./context/AuthContext";
import { SEO } from "./config/seo";
import StructuredData from "./components/StructuredData";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import AboutMe from "./components/AboutMe";
import AboutCompany from "./components/AboutCompany";
import PricingCalculator from "./components/PricingCalculator";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CustomCursor from "./components/CustomCursor";
import AuthModal from "./components/AuthModal";

// Lazy-load the modal — it's large and only shown on demand
const ServiceRequestModal = lazy(() => import("./components/ServiceRequestModal"));

/** Dynamic meta tags — language-aware, lives inside LanguageProvider */
function SeoHead() {
  const { lang, t } = useLanguage();
  const isNL = lang === "nl";

  return (
    <Helmet>
      <html lang={isNL ? "nl-BE" : "en-GB"} />
      <title>{t("seo.title")}</title>
      <meta name="description"  content={t("seo.description")} />
      <meta name="keywords"     content={SEO.keywords} />
      <meta name="author"       content={SEO.siteName} />
      <link rel="canonical"     href={SEO.siteUrl} />
      <meta name="robots"       content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={SEO.siteUrl} />
      <meta property="og:title"       content={t("seo.title")} />
      <meta property="og:description" content={t("seo.description")} />
      <meta property="og:image"       content={`${SEO.siteUrl}/og-image.png`} />
      <meta property="og:locale"      content={isNL ? SEO.locale : SEO.localeAlt} />
      <meta property="og:site_name"   content={SEO.siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={SEO.twitterHandle} />
      <meta name="twitter:title"       content={t("seo.title")} />
      <meta name="twitter:description" content={t("seo.description")} />
      <meta name="twitter:image"       content={`${SEO.siteUrl}/og-image.png`} />

      {/* hreflang alternates */}
      <link rel="alternate" hreflang="nl" href={`${SEO.siteUrl}/?lang=nl`} />
      <link rel="alternate" hreflang="en" href={`${SEO.siteUrl}/?lang=en`} />
      <link rel="alternate" hreflang="x-default" href={SEO.siteUrl} />
    </Helmet>
  );
}

function AppDispatcher() {
  const { openModal } = useModal()

  useEffect(() => {
    _registerDispatch((payload) => {
      if (payload?.action === 'openServiceModal') {
        openModal(payload.data ?? null)
      }
    })
    return () => _registerDispatch(null)
  }, [openModal])

  return null
}

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <ModalProvider>
            <AppDispatcher />
            <SeoHead />
            <StructuredData />

            <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 dark">
              <CustomCursor />

              <div className="page-content">
                <Navbar />
                <main id="main-content" className="relative z-10 pt-20">
                  <Hero />
                  <Portfolio />
                  <AboutMe />
                  <AboutCompany />
                  <PricingCalculator />
                  <Contact />
                </main>
                <Footer />
                <ScrollToTop />
              </div>

              {/* Modals — buiten page-content, AuthModal bovenaan de z-stack */}
              <Suspense fallback={null}>
                <ServiceRequestModal />
              </Suspense>
              <AuthModal />
            </div>
          </ModalProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  )
}
