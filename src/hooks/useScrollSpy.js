import { useState, useEffect } from "react";

/**
 * Returns the id of the section currently most visible in the viewport.
 * Uses scroll position + offsetTop — simple, reliable, no ResizeObserver needed.
 */
export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!ids.length) { setActiveId(null); return; }

    const update = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.25;
      let active = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) active = id;
      }
      setActiveId(active);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return activeId;
}
