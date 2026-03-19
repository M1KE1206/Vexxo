import { PricingCalculator } from "@/components/PricingCalculator";

export default function ServicesPage() {
  return (
    <div className="space-y-8 pt-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">
          Services &amp; Pricing
        </h1>
        <p className="max-w-xl text-sm text-[color:var(--text-muted)]">
          Kies een formule die past bij jouw zaak. Elke samenwerking start met
          een vrijblijvend intakegesprek waarin we je doelen en budget
          afstemmen.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="card card-hover p-5 text-sm text-[color:var(--text-muted)]">
          <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
            Design
          </h2>
          <ul className="mt-3 space-y-2 text-xs">
            <li>· Logo, kleuren en typografie afgestemd op je merk</li>
            <li>· UI-design voor website of webapp in Figma</li>
            <li>· Design system en componenten voor hergebruik</li>
            <li>· Levering van alle exports voor drukwerk en online</li>
          </ul>
        </article>

        <article className="card card-hover p-5 text-sm text-[color:var(--text-muted)]">
          <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
            Development
          </h2>
          <ul className="mt-3 space-y-2 text-xs">
            <li>· Next.js websites met focus op performance en SEO</li>
            <li>· Responsive layout die goed werkt op mobiel en desktop</li>
            <li>· Integraties met tools zoals e-mailmarketing of formulieren</li>
            <li>· Basisbeheer: kleine aanpassingen en support na oplevering</li>
          </ul>
        </article>

        <article className="card card-hover p-5 text-sm text-[color:var(--text-muted)]">
          <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
            Fullstack
          </h2>
          <ul className="mt-3 space-y-2 text-xs">
            <li>· Combinatie van branding, UX/UI en development</li>
            <li>· Helder plan van aanpak met timing en milestones</li>
            <li>· Optie om later functionaliteit zoals portalen toe te voegen</li>
            <li>· Eén aanspreekpunt voor alles wat digitaal is</li>
          </ul>
        </article>
      </section>

      <PricingCalculator />
    </div>
  );
}

