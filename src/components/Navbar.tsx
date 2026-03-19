 "use client";

import Link from "next/link";
import { LogoMark } from "./LogoMark";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/over-mij", label: "Over mij" },
  { href: "/services", label: "Services" },
  { href: "/clientportaal", label: "Clientportaal" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-sm font-semibold tracking-[0.3em] text-[color:var(--text-primary)]">
            VEXXO
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-xs font-medium text-[color:var(--text-muted)] md:flex">
          {navLinks.map((link) =>
            link.label === "Clientportaal" ? (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-[color:var(--orbit-purple)] px-4 py-1.5 text-xs font-semibold text-[color:var(--orbit-purple)] transition-colors hover:bg-[rgba(124,108,246,0.12)]"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[color:var(--text-primary)]"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-[color:var(--border)] p-2 text-[color:var(--text-muted)] md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="block h-0.5 w-5 bg-[color:var(--text-primary)]" />
          <span className="mt-1 block h-0.5 w-5 bg-[color:var(--text-primary)]" />
        </button>
      </nav>

      {open && (
        <div className="border-t border-[color:var(--border)] bg-[color:var(--background)] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col space-y-1 px-6 py-3 text-sm font-medium text-[color:var(--text-muted)]">
            {navLinks.map((link) =>
              link.label === "Clientportaal" ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[color:var(--orbit-purple)] px-4 py-2 text-xs font-semibold text-[color:var(--orbit-purple)]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1 hover:text-[color:var(--text-primary)]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </header>
  );
}

