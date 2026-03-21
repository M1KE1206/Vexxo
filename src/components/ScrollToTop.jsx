import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center
        bg-gradient-to-br from-primary to-secondary text-on-primary-fixed font-bold text-lg
        shadow-[0_0_20px_rgba(189,157,255,0.35)] hover:scale-110 active:scale-95
        transition-all duration-200"
    >
      ↑
    </button>
  );
}
