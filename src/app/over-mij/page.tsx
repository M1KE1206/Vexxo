const skills = ["Next.js", "TypeScript", "Tailwind", "Figma", "Supabase", "Vercel"];

export default function OverMijPage() {
  return (
    <div className="space-y-8 pt-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">
          Over mij
        </h1>
        <p className="max-w-xl text-sm text-[color:var(--text-muted)]">
          Vexxo is de studio van Mike David: een jonge webdeveloper die graag
          samenwerkt met ondernemers die vooruit willen.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] md:items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#7C6CF6,transparent_60%),radial-gradient(circle_at_70%_80%,#7C6CF6,transparent_55%)] text-3xl font-semibold text-[color:var(--text-primary)]">
            MD
          </div>
        </div>

        <div className="space-y-6 text-sm text-[color:var(--text-muted)]">
          <p>
            Hey, ik ben Mike — 19 jaar, student en oprichter van Vexxo. Ik bouw
            websites en webapplicaties voor kleine en middelgrote bedrijven in
            België en Nederland. Geen grote bureaus, geen hoge marges — gewoon
            goed werk voor een eerlijke prijs.
          </p>
          <p>
            Ik hou van duidelijke communicatie: één vast aanspreekpunt, korte
            lijnen en een proces dat je begrijpt. Of je nu een eerste website
            nodig hebt of je bestaande platform wilt verbeteren, ik denk met je
            mee vanuit de praktijk.
          </p>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
              Contact
            </h3>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              Heb je een idee of project in gedachten? Stuur gerust een mail, ik
              antwoord meestal binnen 1–2 werkdagen.
            </p>
            <p className="mt-3 text-sm font-medium text-[color:var(--text-primary)]">
              mike@vexxo.be
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

