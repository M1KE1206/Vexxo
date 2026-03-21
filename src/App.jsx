import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import AboutMe from "./components/AboutMe";
import AboutCompany from "./components/AboutCompany";
import PricingCalculator from "./components/PricingCalculator";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 dark">
        {/* Noise texture overlay */}
        <div className="fixed inset-0 bg-noise pointer-events-none z-0" aria-hidden="true" />

        <Navbar />

        <main className="relative z-10 pt-20">
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
    </LanguageProvider>
  );
}
