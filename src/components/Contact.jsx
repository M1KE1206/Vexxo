import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { company } from "../config/company";

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Wire up to Resend / Formspree / EmailJS here
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/4 to-transparent pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/6 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* CTA Header */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-on-surface">
            {t("contact.title")}
          </h2>
          <p className="text-on-surface-variant text-xl max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
          <a
            href={`mailto:${company.email}`}
            className="btn-primary text-lg px-10 py-5 inline-flex"
          >
            {t("contact.ctaButton")}
          </a>
        </div>

        {/* Contact info row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-on-surface-variant mb-16">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">mail</span>
            <a href={`mailto:${company.email}`} className="font-medium hover:text-primary transition-colors">
              {company.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">language</span>
            <span className="font-medium">{company.website}</span>
          </div>
        </div>

        {/* Contact form */}
        <div className="glass-card rounded-3xl p-8">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <span className="material-symbols-outlined text-secondary text-5xl">check_circle</span>
              <p className="text-on-surface font-semibold text-lg">{t("contact.thanks")}</p>
              <p className="text-on-surface-variant text-sm">{t("contact.responseTime")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("contact.name")}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("contact.email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("contact.message")}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </span>
                ) : t("contact.send")}
              </button>
              <p className="text-[11px] text-center text-on-surface-variant">{t("contact.responseTime")}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
