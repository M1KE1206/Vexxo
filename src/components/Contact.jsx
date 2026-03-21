import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { company } from "../config/company";

/** Auto-dismissing toast notification */
function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 4s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9998] flex items-center gap-3 px-5 py-4 rounded-2xl border border-secondary/30 shadow-[0_0_30px_rgba(253,118,26,0.15)] transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ background: "rgba(22,22,30,0.96)", backdropFilter: "blur(16px)" }}
    >
      <span className="material-symbols-outlined text-secondary" style={{ fontSize: 20 }}>check_circle</span>
      <p className="text-sm font-semibold text-on-surface">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }} className="ml-2 text-on-surface-variant hover:text-on-surface text-lg leading-none">×</button>
    </div>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Wire up to Resend / Formspree / EmailJS here
    console.log("Contact form submitted:", form);
    setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      setToast(true);
    }, 1200);
  };

  const inputCls = "w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/40";

  return (
    <section id="contact" className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* Left — contact info */}
        <div className="space-y-8">
          <div>
            <span className="text-secondary font-bold text-xs tracking-widest uppercase">{t("contact.badge")}</span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mt-3 text-on-surface">
              {t("contact.title")}
            </h2>
            <p className="text-on-surface-variant mt-4 leading-relaxed">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Contact details */}
          <div className="space-y-4">
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-4 glass-card rounded-2xl p-5 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">mail</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Email</p>
                <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{company.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 glass-card rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-secondary">language</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Website</p>
                <p className="text-sm font-semibold text-on-surface">{company.website}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant">{t("contact.responseTime")}</p>
        </div>

        {/* Right — contact form */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={setField("name")}
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("contact.email")}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={setField("email")}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {t("contact.subject")}
              </label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={setField("subject")}
                placeholder={t("contact.subjectPlaceholder")}
                className={inputCls}
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {t("contact.message")}
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={setField("message")}
                className={inputCls + " resize-none"}
              />
            </div>

            {/* Submit */}
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
        </div>
      </div>

      {/* Success toast */}
      {toast && (
        <Toast message={t("contact.toastSuccess")} onDismiss={() => setToast(false)} />
      )}
    </section>
  );
}
