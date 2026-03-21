import { useEffect, useRef, useState } from "react";

/** Desktop-only custom cursor. Hidden automatically on touch devices via CSS. */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Touch/stylus devices don't need a custom cursor
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    let raf;

    const moveCursor = (e) => {
      if (!dot) return;
      if (!visible) setVisible(true);
      // Use rAF to batch DOM writes
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      });
    };

    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);

    window.addEventListener("mousemove", moveCursor, { passive: true });

    const attachListeners = () => {
      document.querySelectorAll("a, button, [role='button'], label").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    // Attach once on mount; re-attach if new elements appear would need MutationObserver
    attachListeners();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cancelAnimationFrame(raf);
      document.querySelectorAll("a, button, [role='button'], label").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="custom-cursor"
      style={{
        width:      hovering ? 32 : 8,
        height:     hovering ? 32 : 8,
        background: hovering ? "rgba(124,58,237,0.35)" : "white",
        border:     hovering ? "1.5px solid rgba(124,58,237,0.7)" : "none",
        opacity:    visible  ? 1 : 0,
      }}
    />
  );
}
