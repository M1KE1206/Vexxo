import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useModal } from "../context/ModalContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { serviceCategories, packages } from "../config/services";
import { vexxo, addOns, timeline as timelineConfig } from "../config/pricing";

// Created once — Intl.NumberFormat construction is expensive
const formatter = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const fmt = (n) => formatter.format(n);

// serviceType IDs from calculator now match category IDs directly (design/development/fullstack)

/** Step indicator — memoized so it only re-renders when its own props change */
const StepBadge = memo(function StepBadge({ num, label, active, done }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
      active ? "bg-gradient-to-r from-primary to-secondary text-on-primary-fixed" :
      done   ? "bg-surface-container-high text-primary border border-primary/30" :
               "bg-surface-container text-on-surface-variant"
    }`}>
      <span>{num}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
});

/** Package card — memoized so only the 2 affected cards re-render on selection change */
const PkgCard = memo(function PkgCard({ pkg, selected, onSelect, lang }) {
  const name = lang === "nl" ? pkg.nameNL : pkg.name;
  const desc = lang === "nl" ? pkg.descriptionNL : pkg.description;
  return (
    <div
      onClick={() => onSelect(pkg)}
      className={`relative rounded-xl p-4 cursor-pointer border duration-200 hover:-translate-y-1 ${
        selected
          ? "border-primary/70 bg-primary/8 shadow-[0_0_24px_rgba(124,58,237,0.2)] transition-[border-color,box-shadow,background]"
          : "border-outline-variant/30 bg-surface-container hover:border-primary/40 transition-[transform,border-color]"
      }`}
    >
      {/* Checkmark */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary-fixed text-sm" style={{ fontSize: 14 }}>check</span>
        </div>
      )}
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>{pkg.icon}</span>
      </div>
      <h4 className="font-bold text-sm mb-1 text-primary">{name}</h4>
      <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{desc}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-on-surface">
          {fmt(pkg.price)}
          {pkg.priceNote && <span className="text-xs text-on-surface-variant ml-0.5">{pkg.priceNote}</span>}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(pkg); }}
          className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
            selected
              ? "text-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          {selected ? "SELECTED" : "SELECT"}
        </button>
      </div>
    </div>
  );
});

/** Order summary sidebar — memoized, only re-renders when selection or send state changes */
const OrderSummary = memo(function OrderSummary({ pkg, prefill, lang, onSend, loading, sent, t }) {
  const hasCalc   = prefill?.fromCalculator;
  const tlExtra   = hasCalc ? (timelineConfig[prefill.timeline]?.perPage ?? 0) : 0;
  const addonCost = hasCalc
    ? (prefill.seoAddon ? addOns.seo.perPage : 0)
    : 0;
  const calcPrice = hasCalc
    ? Math.round(vexxo.base + (vexxo.perPage + tlExtra + addonCost) * prefill.pages)
    : null;

  const displayPrice = hasCalc ? (calcPrice ?? 0) : (pkg?.price ?? 0);
  const displayName  = pkg ? (lang === "nl" ? pkg.nameNL : pkg.name) : t("modal.noPackage");
  const features     = pkg ? (lang === "nl" ? pkg.features.nl : pkg.features.en) : [];

  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-6 space-y-5">
      <h3 className="font-headline font-bold text-on-surface">{t("modal.orderSummary")}</h3>

      {/* Package row */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{t("modal.package")}</p>
        <div className="flex justify-between items-center">
          <p className={`font-bold text-sm ${pkg ? "text-primary" : "text-on-surface-variant"}`}>{displayName}</p>
          <p className="text-primary font-bold text-sm">{pkg || hasCalc ? fmt(displayPrice) : "—"}</p>
        </div>
      </div>

      {/* Calculator extras */}
      {hasCalc && (
        <div className="space-y-1.5 pt-2 border-t border-outline-variant/20">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">{t("modal.fromCalculator")}</p>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>{t("modal.pages")}</span><span>{prefill.pages}</span>
          </div>
          {prefill.seoAddon && (
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>SEO</span><span>+€{addOns.seo.perPage}/{lang === "nl" ? "pag." : "pg."}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>{t("modal.timeline")}</span>
            <span>{lang === "nl" ? timelineConfig[prefill.timeline]?.labelNL : timelineConfig[prefill.timeline]?.labelEN}</span>
          </div>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">{t("modal.includedFeatures")}</p>
          <ul className="space-y-1.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: 14 }}>check</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Totals */}
      <div className="pt-3 border-t border-outline-variant/20 space-y-2">
        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>{t("modal.subtotal")}</span>
          <span>{pkg || hasCalc ? fmt(displayPrice) : "—"}</span>
        </div>
        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>{t("modal.vat")}</span><span>€0</span>
        </div>
        <div className="flex justify-between font-headline font-bold text-on-surface text-base pt-1">
          <span>{t("modal.totalEstimate")}</span>
          <span>{pkg || hasCalc ? fmt(displayPrice) : "—"}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onSend}
        disabled={loading || sent}
        className="w-full py-4 rounded-xl font-bold text-sm text-on-primary-fixed flex items-center justify-center gap-2 transition-[opacity,transform] hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        style={{ background: "linear-gradient(to right, #7C3AED, #F97316)" }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("modal.sendingLabel")}
          </>
        ) : sent ? (
          <><span className="material-symbols-outlined text-base">check_circle</span> {t("modal.successTitle")}</>
        ) : t("modal.sendRequest")}
      </button>

      <p className="text-[10px] text-on-surface-variant/50 text-center leading-snug">{t("modal.termsNote")}</p>

      {/* Social proof */}
      <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
        <div className="flex -space-x-2">
          {["#7C3AED","#F97316","#6d28d9"].map((c, i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-surface-container-low flex items-center justify-center text-[9px] font-bold text-on-primary-fixed" style={{ background: c }}>
              {["M","A","J"][i]}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-surface-container-low bg-surface-container-high flex items-center justify-center text-[9px] text-on-surface-variant font-bold">+12</div>
        </div>
        <p className="text-[11px] text-on-surface-variant leading-snug">{t("modal.socialProof")}</p>
      </div>
    </div>
  );
});

/** Main modal */
export default function ServiceRequestModal() {
  const { isOpen, closeModal, prefillData } = useModal();
  const { t, lang }  = useLanguage();
  const { user } = useAuth();
  const [visible,    setVisible]    = useState(false);
  const [activeTab,  setActiveTab]  = useState("design");
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [step,       setStep]       = useState(1);
  const [form,       setForm]       = useState({ fullName: "", company: "", email: "", phone: "", preferredContact: "email", deadline: "", notes: "" });
  const [loading,    setLoading]    = useState(false);
  const [sent,       setSent]       = useState(false);
  const scrollRef = useRef(null);

  // Open/close animation
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedPkg(null);
      setSent(false);
      setLoading(false);
      setForm({
        fullName: user?.user_metadata?.full_name ?? "",
        company: "",
        email: user?.email ?? "",
        phone: "",
        preferredContact: "email",
        deadline: "",
        notes: "",
      });
      if (prefillData?.fromCalculator && prefillData.serviceType) {
        setActiveTab(prefillData.serviceType);
      } else {
        setActiveTab("design");
      }
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen, prefillData, user]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && isOpen) closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal, isOpen]);

  // Stable callback — required for PkgCard.memo to skip re-renders
  const handleSelect = useCallback((pkg) => {
    setSelectedPkg(pkg);
    setStep((prev) => {
      if (prev === 1) {
        setTimeout(() => {
          scrollRef.current?.querySelector("#brief-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return 2;
      }
      return prev;
    });
  }, []);

  const handleSend = useCallback(() => {
    setLoading((prev) => {
      if (prev) return prev;
      console.log("Service request:", { pkg: selectedPkg?.id, prefillData, form });
      setTimeout(() => { setLoading(false); setSent(true); }, 1400);
      return true;
    });
  }, [selectedPkg, prefillData, form]);

  const setField = useCallback((key) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  }, []);

  const catPkgs = packages[activeTab] || [];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-4 px-4 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ background: "rgba(10,10,19,0.9)", visibility: isOpen ? "visible" : "hidden", pointerEvents: isOpen ? "auto" : "none" }}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        className={`relative w-full max-w-5xl my-auto transition-[transform,opacity] duration-300 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        style={{ background: "rgba(20,20,28,0.99)", border: "1px solid rgba(124,58,237,0.18)", borderRadius: "1.5rem" }}
      >
        {/* Close */}
        <button
          onClick={closeModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-primary/50 transition-colors text-xl font-light"
        >
          ×
        </button>

        {/* Header */}
        <div className="px-6 md:px-8 pt-7 pb-5 border-b border-outline-variant/15">
          <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface">{t("modal.title")}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t("modal.subtitle")}</p>
          {/* Steps */}
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            <StepBadge num="①" label={t("modal.stepChoose")} active={step === 1} done={step > 1} />
            <span className="text-outline text-sm" aria-hidden="true">→</span>
            <StepBadge num="②" label={t("modal.stepBrief")}  active={step === 2} done={step > 2} />
            <span className="text-outline text-sm" aria-hidden="true">→</span>
            <StepBadge num="③" label={t("modal.stepSend")}   active={sent}       done={false} />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row" ref={scrollRef}>
          {/* Left — scrollable panel */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[70vh] lg:max-h-[75vh] space-y-8 lg:border-r border-outline-variant/15">

            {/* ── Section 1: Package selector ── */}
            <div>
              <h3 className="font-headline font-bold text-on-surface mb-4">{t("modal.selectPackage")}</h3>
              {/* Category tabs */}
              <div className="flex gap-2 mb-5 p-1 rounded-xl bg-surface-container w-fit">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === cat.id
                        ? "bg-surface-bright text-on-surface shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {lang === "nl" ? cat.labelNL : cat.labelEN}
                  </button>
                ))}
              </div>
              {/* Package cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catPkgs.map((pkg) => (
                  <PkgCard
                    key={pkg.id}
                    pkg={pkg}
                    selected={selectedPkg?.id === pkg.id}
                    onSelect={handleSelect}
                    lang={lang}
                  />
                ))}
              </div>
            </div>

            {/* ── Section 2: Project brief ── */}
            <div id="brief-section">
              <h3 className="font-headline font-bold text-on-surface mb-4">{t("modal.projectBrief")}</h3>
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container p-5 space-y-4">
                {/* Name + Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t("modal.fields.fullName")}</label>
                    <input type="text" value={form.fullName} onChange={setField("fullName")} placeholder={t("modal.fields.fullNamePlaceholder")} className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/40" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t("modal.fields.companyName")}</label>
                    <input type="text" value={form.company} onChange={setField("company")} placeholder={t("modal.fields.companyPlaceholder")} className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/40" />
                  </div>
                </div>
                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t("modal.fields.email")}</label>
                    <input type="email" value={form.email} onChange={setField("email")} placeholder={t("modal.fields.emailPlaceholder")} className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/40" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t("modal.fields.phone")}</label>
                    <input type="tel" value={form.phone} onChange={setField("phone")} placeholder={t("modal.fields.phonePlaceholder")} className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/40" />
                  </div>
                </div>
                {/* Preferred contact + Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t("modal.fields.preferredContact")}</label>
                    <div className="flex gap-3 pt-1">
                      {["email", "phone"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <div
                            onClick={() => setForm((f) => ({ ...f, preferredContact: opt }))}
                            className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${form.preferredContact === opt ? "bg-primary" : "bg-surface-container-highest"}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-on-primary-fixed transition-[left] duration-200 ${form.preferredContact === opt ? "left-5" : "left-0.5"}`} />
                          </div>
                          <span className="text-xs text-on-surface-variant capitalize">
                            {opt === "email" ? t("modal.fields.contactEmail") : t("modal.fields.contactPhone")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t("modal.fields.deadline")}</label>
                    <input type="date" value={form.deadline} onChange={setField("deadline")} className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/40" />
                  </div>
                </div>
                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t("modal.fields.notes")}</label>
                  <textarea rows={4} value={form.notes} onChange={setField("notes")} placeholder={t("modal.fields.notesPlaceholder")} className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/40 resize-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right — sticky order summary */}
          <div className="lg:w-80 xl:w-96 p-5 lg:p-6 lg:sticky lg:top-0 lg:self-start lg:max-h-screen lg:overflow-y-auto">
            <OrderSummary
              pkg={selectedPkg}
              prefill={prefillData}
              lang={lang}
              onSend={handleSend}
              loading={loading}
              sent={sent}
              t={t}
            />
            {sent && (
              <div className="mt-4 p-4 rounded-xl bg-secondary/10 border border-secondary/30 text-center">
                <p className="text-sm font-bold text-on-surface">{t("modal.successTitle")}</p>
                <p className="text-xs text-on-surface-variant mt-1">{t("modal.successBody")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
