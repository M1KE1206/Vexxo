import { motion, useReducedMotion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import { useLanguage } from "../context/LanguageContext";
import { company } from "../config/company";
import { fadeUp, viewport, ease } from "../lib/animations";

export default function Contact() {
  const { t } = useLanguage();
  const [state, handleSubmit] = useForm("xwvwgrva");

  const inputCls = "w-full rounded-xl border border-on-surface-variant/20 bg-surface-2 px-4 py-3 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/40";

  const reduce = useReducedMotion();
  const ini = reduce ? false : "hidden";

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
      <motion.div
        className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start"
        variants={fadeUp}
        initial={ini}
        whileInView="visible"
        viewport={viewport}
        transition={{ duration: 0.6, ease }}
      >

        {/* Left — contact info */}
        <div className="space-y-8">
          <div>
            <span className="text-accent font-bold text-xs tracking-widest uppercase">{t("contact.badge")}</span>
            <h2 id="contact-heading" className="text-4xl md:text-5xl font-headline font-bold mt-3 text-on-surface">
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
          {state.succeeded ? (
            <motion.div
              className="flex flex-col items-center justify-center gap-5 py-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 32 }}>check_circle</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold text-on-surface">{t("contact.successTitle")}</h3>
                <p className="text-sm text-on-surface-variant max-w-xs">{t("contact.successBody")}</p>
              </div>
            </motion.div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={inputCls}
                />
                <ValidationError field="name" errors={state.errors} className="text-[11px] text-red-400 mt-1" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("contact.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className={inputCls}
                />
                <ValidationError field="email" errors={state.errors} className="text-[11px] text-red-400 mt-1" />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {t("contact.subject")}
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder={t("contact.subjectPlaceholder")}
                className={inputCls}
              />
              <ValidationError field="subject" errors={state.errors} className="text-[11px] text-red-400 mt-1" />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {t("contact.message")}
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className={inputCls + " resize-none"}
              />
              <ValidationError field="message" errors={state.errors} className="text-[11px] text-red-400 mt-1" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={state.submitting}
              className="btn-primary w-full justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {state.submitting ? (
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
      </motion.div>

    </section>
  );
}
