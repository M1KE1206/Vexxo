import { useLanguage } from "../context/LanguageContext";
import { founder, company } from "../config/company";

const STATS = [
  { value: "3+",   key: "projects" },
  { value: "2",    key: "countries" },
  { value: "100%", key: "satisfaction" },
];

export default function AboutMe() {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="py-24 px-6 md:px-8 bg-surface-container-low relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/6 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Text — left on desktop */}
        <div className="order-2 md:order-1 space-y-8">
          <div>
            <span className="text-secondary font-bold text-xs tracking-widest uppercase">
              {t("about.badge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mt-3 text-on-surface">
              {t("about.title")}
            </h2>
          </div>

          <p className="text-on-surface-variant text-lg leading-relaxed">
            {t("about.subtitle")}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {STATS.map(({ value, key }) => (
              <div key={key} className="glass-card px-6 py-3 rounded-full flex items-center gap-3">
                <span className="text-primary font-bold text-lg">{value}</span>
                <span className="text-sm font-semibold text-on-surface-variant">
                  {t(`about.stats.${key}`)}
                </span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">
              {t("about.skillsTitle")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {founder.skills.map((skill) => (
                <span key={skill} className="pill">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Photo / card — right on desktop */}
        <div className="order-1 md:order-2 relative flex justify-center">
          {/* Workspace placeholder */}
          <div className="glass-card p-2 rounded-3xl md:rotate-3 w-full max-w-sm aspect-square overflow-hidden relative">
            {/* Placeholder gradient */}
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 via-surface-container to-secondary/15 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto text-2xl font-bold text-on-primary-fixed font-headline">
                  {founder.initials}
                </div>
                <p className="text-on-surface font-semibold">{founder.name}</p>
                <p className="text-on-surface-variant text-xs">{company?.tagline}</p>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-2xl hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">school</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">{t("about.badge2")}</p>
              <p className="text-[11px] text-on-surface-variant">{t("about.badge2sub")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

