// src/pages/HomePage.jsx
import Hero from '../components/Hero'
import Portfolio from '../components/Portfolio'
import AboutMe from '../components/AboutMe'
import AboutCompany from '../components/AboutCompany'
import Contact from '../components/Contact'

export default function HomePage() {
  return (
    <main id="main-content" className="relative z-10 pt-20">
      <Hero />
      <Portfolio />
      <AboutMe />
      <AboutCompany />
      <Contact />
    </main>
  )
}
