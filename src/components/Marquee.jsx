import { useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const ITEMS = [
  "Web Design",
  "Web Development",
  "Branding",
  "SEO Optimization",
  "UI/UX Design",
  "React",
  "Next.js",
];

const SEP = <span style={{ color: "var(--primary)", fontSize: 8 }} aria-hidden="true">◆</span>;

function MarqueeRow() {
  const items = [...ITEMS, ...ITEMS]; // doubled for seamless loop
  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6 mr-6 text-xs font-bold uppercase tracking-widest text-on-surface">
          {item}{SEP}
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  const reduce = useReducedMotion();

  return (
    <div
      className="overflow-hidden border-y border-white/5 py-3 select-none"
      aria-hidden="true"
      style={{ opacity: 0.35 }}
    >
      <div
        className={reduce ? "flex" : "flex animate-marquee"}
        style={{ whiteSpace: "nowrap" }}
      >
        <MarqueeRow />
      </div>
    </div>
  );
}
