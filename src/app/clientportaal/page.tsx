"use client";

import { FormEvent, useState } from "react";

const steps = [
  "Kies je service",
  "Vul je brief in",
  "Ontvang bevestiging binnen 1 werkdag",
  "Intakegesprek",
  "Aan de slag",
];

export default function ClientportaalPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-8 pt-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">
          Start een project
        </h1>
        <p className="max-w-xl text-sm text-[color:var(--text-muted)]">
          Vul het formulier zo concreet mogelijk in. Op basis hiervan plannen we
          een gratis intakegesprek in.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
          Hoe het werkt
        </h2>
        <ol className="grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <li
              key={step}
              className="card card-hover flex flex-col gap-2 p-3 text-xs text-[color:var(--text-muted)]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--orbit-purple)] text-[11px] font-semibold text-[color:var(--text-primary)]">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] md:items-start">
        <form onSubmit={handleSubmit} className="card space-y-4 p-5 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
              Service type
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {[
                "Only Design",
                "Only Development",
                "Design + Development",
                "Full Rebrand",
              ].map((label) => (
                <label
                  key={label}
                  className="card card-hover flex cursor-pointer items-center gap-2 px-3 py-2 text-xs"
                >
                  <input
                    type="radio"
                    name="service"
                    defaultChecked={label === "Design + Development"}
                    className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                  />
                  <span className="text-[color:var(--text-primary)]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-[color:var(--text-muted)]" htmlFor="naam">
                Naam
              </label>
              <input
                id="naam"
                name="naam"
                className="h-9 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text-primary)] outline-none focus:border-[color:var(--orbit-purple)]"
                required
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs text-[color:var(--text-muted)]"
                htmlFor="bedrijfsnaam"
              >
                Bedrijfsnaam
              </label>
              <input
                id="bedrijfsnaam"
                name="bedrijfsnaam"
                className="h-9 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text-primary)] outline-none focus:border-[color:var(--orbit-purple)]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label
                className="text-xs text-[color:var(--text-muted)]"
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="h-9 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text-primary)] outline-none focus:border-[color:var(--orbit-purple)]"
                required
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs text-[color:var(--text-muted)]"
                htmlFor="telefoon"
              >
                Telefoon
              </label>
              <input
                id="telefoon"
                name="telefoon"
                className="h-9 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-xs text-[color:var(--text-primary)] outline-none focus:border-[color:var(--orbit-purple)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              className="text-xs text-[color:var(--text-muted)]"
              htmlFor="beschrijving"
            >
              Korte projectbeschrijving
            </label>
            <textarea
              id="beschrijving"
              name="beschrijving"
              rows={4}
              className="w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs text-[color:var(--text-primary)] outline-none focus:border-[color:var(--orbit-purple)]"
              placeholder="Vertel kort wat je wil laten maken, deadlines en specifieke wensen."
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-[color:var(--text-muted)]">
              Gewenste contactmethode
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-[color:var(--text-muted)]">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="contact"
                  defaultChecked
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                />
                Telefoon
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="contact"
                  className="h-3 w-3 accent-[color:var(--orbit-purple)]"
                />
                E-mail
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary mt-2 w-full md:w-auto">
            Aanvraag versturen
          </button>

          {submitted && (
            <p className="mt-3 text-xs text-[color:var(--text-primary)]">
              Bedankt! Ik neem binnen 1 werkdag contact op.
            </p>
          )}

          <p className="mt-2 text-[11px] text-[color:var(--text-muted)]">
            Geen directe betaling — na je aanvraag plannen we een gratis
            intakegesprek.
          </p>
        </form>

        <div className="space-y-4 text-sm text-[color:var(--text-muted)]">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
              Wat gebeurt er na je aanvraag?
            </h2>
            <p className="mt-2 text-xs">
              Binnen twee werkdagen ontvang je een reactie met voorstel voor
              een kort intakegesprek (online). Tijdens dat gesprek lopen we je
              antwoorden door en krijg je een eerste indicatie van planning en
              budget.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

