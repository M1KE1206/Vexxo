"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type ServiceType = "design" | "development" | "design-dev" | "rebrand";

const serviceBasePrices: Record<ServiceType, number> = {
  design: 150,
  development: 200,
  "design-dev": 299,
  rebrand: 500,
};

export function PricingCalculator() {
  const [service, setService] = useState<ServiceType>("design-dev");
  const [pages, setPages] = useState(5);
  const [contentHelp, setContentHelp] = useState(false);
  const [seo, setSeo] = useState(false);
  const [timeline, setTimeline] = useState<"7" | "14" | "regular">("regular");

  const [vexxoPrice, setVexxoPrice] = useState(0);
  const [agencyPrice, setAgencyPrice] = useState(0);
  const [freelancerPrice, setFreelancerPrice] = useState(0);

  useEffect(() => {
    const base = serviceBasePrices[service];

    let perPage = 100;
    if (timeline === "7") perPage += 100;
    if (timeline === "14") perPage += 25;
    if (contentHelp) perPage += 50;
    if (seo) perPage += 50;

    const vexxo = base + perPage * pages;
    const agency = 2000 + 400 * pages;
    const freelancer = 1000 + 200 * pages;

    setVexxoPrice(vexxo);
    setAgencyPrice(agency);
    setFreelancerPrice(freelancer);
  }, [service, pages, contentHelp, seo, timeline]);

  return (
    <section className="card card-hover mt-10 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
            Schat je investering in
          </h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            Zie in één oogopslag wat een project met Vexxo ongeveer kost
            vergeleken met een gemiddeld bureau of freelancer.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6 text-sm text-[color:var(--text-muted)]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
              Service type
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="card card-hover flex cursor-pointer items-center gap-2 px-3 py-2">
                <input
                  type="radio"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={service === "design"}
                  onChange={() => setService("design")}
                />
                <span>
                  <span className="block text-xs font-medium text-[color:var(--text-primary)]">
                    Only Design
                  </span>
                  <span className="block text-[11px] text-[color:var(--text-muted)]">
                    Basis: {formatCurrency(serviceBasePrices.design)}
                  </span>
                </span>
              </label>
              <label className="card card-hover flex cursor-pointer items-center gap-2 px-3 py-2">
                <input
                  type="radio"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={service === "development"}
                  onChange={() => setService("development")}
                />
                <span>
                  <span className="block text-xs font-medium text-[color:var(--text-primary)]">
                    Only Development
                  </span>
                  <span className="block text-[11px] text-[color:var(--text-muted)]">
                    Basis: {formatCurrency(serviceBasePrices.development)}
                  </span>
                </span>
              </label>
              <label className="card card-hover flex cursor-pointer items-center gap-2 px-3 py-2">
                <input
                  type="radio"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={service === "design-dev"}
                  onChange={() => setService("design-dev")}
                />
                <span>
                  <span className="block text-xs font-medium text-[color:var(--text-primary)]">
                    Design + Development
                  </span>
                  <span className="block text-[11px] text-[color:var(--text-muted)]">
                    Basis: {formatCurrency(serviceBasePrices["design-dev"])}
                  </span>
                </span>
              </label>
              <label className="card card-hover flex cursor-pointer items-center gap-2 px-3 py-2">
                <input
                  type="radio"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={service === "rebrand"}
                  onChange={() => setService("rebrand")}
                />
                <span>
                  <span className="block text-xs font-medium text-[color:var(--text-primary)]">
                    Full Rebrand
                  </span>
                  <span className="block text-[11px] text-[color:var(--text-muted)]">
                    Basis: {formatCurrency(serviceBasePrices.rebrand)}
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                Aantal pagina&apos;s
              </span>
              <span className="text-[color:var(--text-primary)]">
                {pages} pagina{pages !== 1 ? "&#39;s" : ""} · €100/pagina
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full accent-[color:var(--orbit-purple)]"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
              Add-ons
            </p>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={contentHelp}
                  onChange={(e) => setContentHelp(e.target.checked)}
                />
                <span>
                  <span className="block text-[color:var(--text-primary)]">
                    Hulp met content (foto&apos;s, teksten)
                  </span>
                  <span className="block text-[11px] text-[color:var(--text-muted)]">
                    + €50 per pagina
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={seo}
                  onChange={(e) => setSeo(e.target.checked)}
                />
                <span>
                  <span className="block text-[color:var(--text-primary)]">
                    SEO optimalisatie
                  </span>
                  <span className="block text-[11px] text-[color:var(--text-muted)]">
                    + €50 per pagina
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
              Tijdlijn
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="card card-hover flex cursor-pointer flex-col gap-1 px-3 py-2 text-xs">
                <input
                  type="radio"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={timeline === "7"}
                  onChange={() => setTimeline("7")}
                />
                <span className="font-medium text-[color:var(--text-primary)]">
                  Binnen 7 dagen
                </span>
                <span className="text-[11px] text-[color:var(--text-muted)]">
                  + €100 per pagina
                </span>
              </label>
              <label className="card card-hover flex cursor-pointer flex-col gap-1 px-3 py-2 text-xs">
                <input
                  type="radio"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={timeline === "14"}
                  onChange={() => setTimeline("14")}
                />
                <span className="font-medium text-[color:var(--text-primary)]">
                  Binnen 14 dagen
                </span>
                <span className="text-[11px] text-[color:var(--text-muted)]">
                  + €25 per pagina
                </span>
              </label>
              <label className="card card-hover flex cursor-pointer flex-col gap-1 px-3 py-2 text-xs">
                <input
                  type="radio"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  checked={timeline === "regular"}
                  onChange={() => setTimeline("regular")}
                />
                <span className="font-medium text-[color:var(--text-primary)]">
                  Normale snelheid
                </span>
                <span className="text-[11px] text-[color:var(--text-muted)]">
                  Geen extra toeslag
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-1">
            <div className="card p-4 text-sm text-[color:var(--text-muted)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                Gemiddeld bureau
              </p>
              <p className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)] transition-all duration-200">
                {formatCurrency(agencyPrice)}
              </p>
              <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                €2000 basis + €400 per pagina
              </p>
              <p className="mt-3 text-xs text-[color:var(--text-muted)]">
                Hoge marges, lange doorlooptijd.
              </p>
            </div>

            <div className="card p-4 text-sm text-[color:var(--text-muted)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                Gewone freelancer
              </p>
              <p className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)] transition-all duration-200">
                {formatCurrency(freelancerPrice)}
              </p>
              <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                €1000 basis + €200 per pagina
              </p>
              <p className="mt-3 text-xs text-[color:var(--text-muted)]">
                Veel heen-en-weer, minder structuur.
              </p>
            </div>
          </div>

          <div className="relative mt-2">
            <div className="card border-[rgba(124,108,246,0.7)] bg-gradient-to-br from-[rgba(124,108,246,0.16)] via-[rgba(8,8,16,0.9)] to-[rgba(124,108,246,0.28)] p-5 text-sm text-[color:var(--text-primary)] shadow-orbit-glow">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                Met Vexxo
              </p>
              <p className="mt-3 text-3xl font-semibold transition-all duration-200">
                {formatCurrency(vexxoPrice)}
              </p>
              <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                Basis + €100 per pagina + gekozen add-ons en tijdslijn.
              </p>
              <p className="mt-4 text-xs text-[color:var(--text-primary)]">
                Bespaar tijd, geld en stress.
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-[color:var(--text-muted)]">
            Dit is een indicatieve schatting. De uiteindelijke prijs wordt
            bepaald na het intakegesprek.
          </p>
        </div>
      </div>
    </section>
  );
}

