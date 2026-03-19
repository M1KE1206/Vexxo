import Link from "next/link";
import { LogoMark } from "./LogoMark";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[color:var(--border)] bg-[color:var(--background)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="text-xs font-semibold tracking-[0.3em] text-[color:var(--text-primary)]">
              VEXXO
            </span>
          </div>
          <p className="text-xs text-[color:var(--text-muted)]">
            © 2026 Vexxo — Web design &amp; development
          </p>
          <p className="text-xs text-[color:var(--text-muted)]">vexxo.be</p>
        </div>

        <div className="space-y-3 text-xs text-[color:var(--text-muted)]">
          <div className="flex flex-wrap gap-4">
            <Link href="/portfolio" className="hover:text-[color:var(--text-primary)]">
              Portfolio
            </Link>
            <Link href="/over-mij" className="hover:text-[color:var(--text-primary)]">
              Over mij
            </Link>
            <Link href="/services" className="hover:text-[color:var(--text-primary)]">
              Services
            </Link>
            <Link
              href="/clientportaal"
              className="hover:text-[color:var(--text-primary)]"
            >
              Clientportaal
            </Link>
          </div>
          <p className="text-xs text-[color:var(--text-muted)]">mike@vexxo.be</p>
        </div>
      </div>
    </footer>
  );
}

