import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

const steps = [
  "Kies je service",
  "Vul je brief in",
  "Ontvang bevestiging binnen 2 werkdagen",
  "Intakegesprek",
  "Aan de slag",
];

export default function HomePage() {
  return (
    <div className="space-y-24">
      <section className="relative grid gap-10 pt-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-3 py-1 text-[11px] text-[color:var(--text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--orbit-purple)]" />
            Vexxo · Web design &amp; development studio
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] md:text-4xl lg:text-5xl">
              Wij bouwen websites die werken.
            </h1>
            <p className="max-w-xl text-sm text-[color:var(--text-muted)] md:text-base">
              Web design &amp; development voor Belgische en Nederlandse
              ondernemers. Modern, snel en zonder gedoe. Jij focust op je
              zaak, wij regelen je online aanwezigheid.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/portfolio" className="btn-outline">
              Bekijk ons werk
            </Link>
            <Link href="/clientportaal" className="btn-primary">
              Start een project
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] text-[color:var(--text-muted)]">
            <span className="pill">Next.js</span>
            <span className="pill">Tailwind CSS</span>
            <span className="pill">TypeScript</span>
            <span className="pill">Snelle oplevering</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center md:justify-end">
          <div className="pointer-events-none absolute inset-0 -right-10 translate-y-4 opacity-40 blur-2xl">
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(124,108,246,0.5),transparent_60%)]" />
          </div>
          <div className="relative z-10 card flex h-64 w-full max-w-sm flex-col items-center justify-center gap-4 bg-[color:var(--surface)]/80 p-6">
            <LogoMark />
            <p className="text-xs font-semibold tracking-[0.22em] text-[color:var(--text-muted)]">
              DIGITAAL STUDIO
            </p>
            <p className="text-center text-sm text-[color:var(--text-primary)]">
              Eén vaste contactpersoon, heldere communicatie en een website die
              mee groeit met je bedrijf.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            Wat we doen
          </h2>
          <p className="max-w-xl text-sm text-[color:var(--text-muted)]">
            Van eerste schets tot livegang. Jij krijgt een website die er goed
            uitziet en tegelijk écht werkt voor je business.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="card card-hover p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--orbit-purple)]">
              Design
            </p>
            <h3 className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">
              Van logo tot volledige brand identity
            </h3>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Een visuele stijl die bij jou past en blijft hangen bij je
              klanten.
            </p>
          </div>
          <div className="card card-hover p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--orbit-purple)]">
              Development
            </p>
            <h3 className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">
              Snelle, moderne websites en webapps
            </h3>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Gebouwd met moderne tools, goed vindbaar en klaar om op te
              schalen.
            </p>
          </div>
          <div className="card card-hover p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--orbit-purple)]">
              Fullstack
            </p>
            <h3 className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">
              Design én development onder één dak
            </h3>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Geen losse freelancers, maar één studio die alles voor je
              coördineert.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            Hoe het werkt
          </h2>
          <p className="max-w-xl text-sm text-[color:var(--text-muted)]">
            Duidelijk stappenplan, geen verrassingen. Jij weet op elk moment
            waar we staan.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="card card-hover flex items-start gap-3 p-4 text-sm"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--orbit-purple)] text-xs font-semibold text-[color:var(--text-primary)]">
                {index + 1}
              </span>
              <p className="text-[color:var(--text-primary)]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="card card-hover flex flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">
            Klaar om te starten?
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Vertel kort wat je nodig hebt en we plannen een gratis
            intakegesprek in.
          </p>
        </div>
        <Link href="/clientportaal" className="btn-primary">
          Naar het clientportaal
        </Link>
      </section>
    </div>
  );
}

