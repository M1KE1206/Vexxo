import { useState, useEffect, useRef } from "react";

const AUTO_LINES = [
  "> initializing vexxo.studio...",
  "> loading design system ✓",
  "> compiling components ✓",
  "> optimizing performance ✓",
  "> deploying to production...",
  "> site is live. 🚀",
];

const KEY_ROWS = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

export default function HeroComputer() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState("");
  const [blink, setBlink] = useState(true);
  const [pressed, setPressed] = useState(null);
  const [autoMode, setAutoMode] = useState(true);
  const termRef = useRef(null);
  const autoState = useRef({ lineIdx: 0, charIdx: 0 });
  const timerRef = useRef(null);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, []);

  // Auto-typing loop
  useEffect(() => {
    if (!autoMode) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setHistory(AUTO_LINES); return; }

    function tick() {
      const { lineIdx, charIdx } = autoState.current;
      const line = AUTO_LINES[lineIdx];

      if (charIdx < line.length) {
        setCurrent(line.slice(0, charIdx + 1));
        autoState.current.charIdx++;
        timerRef.current = setTimeout(tick, 40 + Math.random() * 25);
      } else {
        // Line done → push to history, move to next
        timerRef.current = setTimeout(() => {
          setHistory((h) => [...h, line]);
          setCurrent("");
          const next = (lineIdx + 1) % AUTO_LINES.length;
          autoState.current = { lineIdx: next, charIdx: 0 };
          if (next === 0) {
            // Brief pause then clear and restart
            timerRef.current = setTimeout(() => {
              setHistory([]);
              tick();
            }, 1800);
          } else {
            timerRef.current = setTimeout(tick, 350);
          }
        }, 500);
      }
    }

    timerRef.current = setTimeout(tick, 1000);
    return () => clearTimeout(timerRef.current);
  }, [autoMode]);

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [history, current]);

  const pressKey = (key) => {
    if (autoMode) {
      setAutoMode(false);
      clearTimeout(timerRef.current);
      setCurrent("");
      setHistory([]);
    }
    setPressed(key);
    setTimeout(() => setPressed(null), 140);

    if (key === "ENTER") {
      if (current.trim()) setHistory((h) => [...h, "> " + current]);
      setCurrent("");
    } else if (key === "BKSP") {
      setCurrent((c) => c.slice(0, -1));
    } else if (key === "SPC") {
      setCurrent((c) => c + " ");
    } else {
      setCurrent((c) => c + key.toLowerCase());
    }
  };

  const keyClass = (k) =>
    `h-6 min-w-[22px] px-1 rounded text-[8px] font-bold border border-white/10
     bg-[rgba(30,30,40,0.7)] backdrop-blur-sm text-on-surface-variant
     transition-all duration-100 select-none cursor-pointer
     hover:border-primary/50 hover:text-on-surface active:scale-90
     ${pressed === k ? "scale-90 border-primary/70 bg-primary/15 shadow-[0_0_8px_rgba(189,157,255,0.5)]" : ""}`;

  return (
    <div className="relative w-full max-w-[400px] mx-auto">
      {/* Ambient glow */}
      <div className="absolute -inset-10 bg-primary/8 blur-[80px] rounded-full pointer-events-none animate-pulse-glow" />

      {/* Monitor — perspective tilt */}
      <div style={{ perspective: "900px" }}>
        <div style={{ transform: "rotateX(6deg)", transformStyle: "preserve-3d" }}>

          {/* Monitor body */}
          <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-b from-[#1c1c28] to-[#13131e] shadow-[0_0_50px_rgba(189,157,255,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]">
            {/* Gradient edge top */}
            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-70" />

            {/* Screen */}
            <div className="relative m-3 overflow-hidden rounded-xl bg-[#060a06]" style={{ aspectRatio: "16/9" }}>
              {/* Scanlines */}
              <div
                className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
                style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,220,80,0.4) 2px,rgba(0,220,80,0.4) 3px)" }}
              />
              {/* Screen glare */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent rounded-xl" />

              {/* Terminal */}
              <div
                ref={termRef}
                className="h-full overflow-hidden p-3 font-mono text-[10px] leading-5 text-[#6ee86e] select-none"
              >
                {history.map((line, i) => (
                  <div key={i} className="opacity-60 truncate">{line}</div>
                ))}
                <div className="flex items-center">
                  <span className="text-[#8ef88e]">{current}</span>
                  <span
                    className="inline-block w-[5px] h-[11px] bg-[#6ee86e] ml-px transition-opacity"
                    style={{ opacity: blink ? 1 : 0 }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom bezel with logo dot */}
            <div className="flex items-center justify-center py-2 gap-2">
              <div className="h-1 w-6 rounded-full bg-gradient-to-r from-primary to-secondary opacity-40" />
            </div>
          </div>

          {/* Stand */}
          <div className="mx-auto w-8 h-5 bg-gradient-to-b from-[#1c1c28] to-[#13131e] border-x border-b border-primary/10" />
          {/* Base */}
          <div className="mx-auto h-[6px] w-28 rounded-full bg-gradient-to-b from-[#1c1c28] to-[#13131e] border border-primary/10 shadow-[0_0_20px_rgba(189,157,255,0.08)]" />
        </div>
      </div>

      {/* Keyboard — hidden on mobile (sm: show) */}
      <div className="relative mt-5 hidden sm:block">
        {/* Keyboard glow */}
        <div className="absolute inset-0 bg-primary/8 blur-2xl rounded-2xl pointer-events-none" />

        <div className="relative rounded-2xl border border-primary/15 bg-gradient-to-b from-[#1a1a26] to-[#111118] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40" />

          <div className="space-y-1">
            {KEY_ROWS.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1">
                {row.map((k) => (
                  <button key={k} onClick={() => pressKey(k)} className={keyClass(k)}>
                    {k}
                  </button>
                ))}
              </div>
            ))}
            {/* Bottom row */}
            <div className="flex justify-center gap-1 mt-0.5">
              <button onClick={() => pressKey("BKSP")} className={keyClass("BKSP") + " px-2"}>⌫</button>
              <button
                onClick={() => pressKey("SPC")}
                className={`h-6 w-28 rounded text-[8px] font-bold border border-white/10 bg-[rgba(30,30,40,0.7)] backdrop-blur-sm text-on-surface-variant transition-all duration-100 cursor-pointer hover:border-primary/50 active:scale-95 ${pressed === "SPC" ? "scale-95 border-primary/70 bg-primary/15" : ""}`}
              />
              <button onClick={() => pressKey("ENTER")} className={`h-6 px-2 rounded text-[8px] font-bold border border-secondary/30 bg-secondary/8 text-secondary cursor-pointer transition-all duration-100 hover:border-secondary/60 active:scale-90 ${pressed === "ENTER" ? "scale-90 border-secondary bg-secondary/20" : ""}`}>↵</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
