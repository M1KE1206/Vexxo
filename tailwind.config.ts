import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        background:            "hsl(var(--color-bg))",
        surface:               "hsl(var(--color-surface))",
        "surface-2":           "hsl(var(--color-surface-2))",
        "surface-3":           "hsl(var(--color-surface-3))",
        "on-surface":          "hsl(var(--color-text))",
        "on-surface-variant":  "hsl(var(--color-text-muted))",
        primary:               "hsl(var(--primary))",
        "primary-dim":         "hsl(var(--primary-dim))",
        secondary:             "hsl(var(--secondary))",
        accent:                "hsl(var(--accent))",
        "on-primary":          "#ffffff",
        "on-primary-fixed":    "#ffffff",
        error:                 "#ff6e84",
        // Legacy compat — keep for src/app/ dormant Next.js files (Phase 6 cleanup)
        "orbit-purple":        "hsl(var(--primary))",
        border:                "hsl(var(--color-border))",
      },
      fontFamily: {
        headline: ["Manrope", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        label: ["Inter", "system-ui", "sans-serif"],
        mono: ["'Fira Code'", "'Cascadia Code'", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        full: "9999px",
      },
      boxShadow: {
        "glow-primary": "0 0 40px rgba(124,58,237,0.3)",
        "glow-secondary": "0 0 40px rgba(249,115,22,0.2)",
        "glow-sm": "0 0 20px rgba(124,58,237,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseGlow: { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "0.8" } },
      },
    },
  },
  plugins: [],
};

export default config;
