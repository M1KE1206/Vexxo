/**
 * Terminal — pure HTML/CSS terminal display embedded in the 3D scene via drei <Html>.
 * Receives state from HeroComputer.jsx as props; owns no state itself.
 */
export default function Terminal({ history, current, blink, termRef }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#060a06",
        padding: "12px",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "10px",
        lineHeight: "1.6",
        color: "#6ee86e",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      {/* Scanlines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,220,80,0.04) 2px,rgba(0,220,80,0.04) 3px)",
          zIndex: 2,
        }}
      />
      {/* Screen-edge purple glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: "inset 0 0 24px rgba(124,58,237,0.18), inset 0 0 6px rgba(0,220,80,0.08)",
          zIndex: 3,
        }}
      />
      {/* Screen glare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
          zIndex: 4,
        }}
      />
      {/* Terminal content */}
      <div
        ref={termRef}
        style={{
          height: "100%",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {history.map((line, i) => (
          <div key={i} style={{ opacity: 0.6, whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis" }}>
            {line}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#8ef88e" }}>{current}</span>
          <span
            style={{
              display: "inline-block",
              width: 5,
              height: 11,
              background: "#6ee86e",
              marginLeft: 2,
              opacity: blink ? 1 : 0,
              transition: "opacity 0.08s",
            }}
          />
        </div>
      </div>
    </div>
  );
}
