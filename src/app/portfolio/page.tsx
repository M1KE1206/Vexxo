import Link from "next/link";

const projects = [
  {
    title: "Demo — Kapperszaak",
    tag: "Design",
    description:
      "Strakke one-pager met online afspraakmodule voor een moderne kapsalon.",
  },
  {
    title: "Demo — Loodgieter",
    tag: "Development",
    description:
      "Praktische website met prijsindicaties, spoedknop en duidelijke call-to-actions.",
  },
  {
    title: "Demo — Horeca",
    tag: "Fullstack",
    description:
      "Digitale menukaart, reservaties en eventpagina voor een druk bezocht horecazaak.",
  },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-8 pt-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">
          Portfolio
        </h1>
        <p className="max-w-xl text-sm text-[color:var(--text-muted)]">
          Een selectie van onze projecten. Volledig uitgewerkte cases volgen
          zodra we live gaan met de eerste klanten.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <article key={project.title} className="card card-hover overflow-hidden">
            <div className="aspect-video w-full bg-[color:var(--border)]/80" />
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
                  {project.title}
                </h2>
                <span className="pill text-[10px]">{project.tag}</span>
              </div>
              <p className="text-xs text-[color:var(--text-muted)]">
                {project.description}
              </p>
              <Link
                href="#"
                aria-disabled="true"
                className="inline-flex items-center text-xs text-[color:var(--text-muted)]"
              >
                Bekijk project →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-[color:var(--text-muted)]">
        Meer projecten volgen binnenkort.
      </p>
    </div>
  );
}

