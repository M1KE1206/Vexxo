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
        background: "#0e0e13",
        surface: "#0f0f1a",
        "surface-dim": "#0e0e13",
        "surface-container": "#19191f",
        "surface-container-low": "#131319",
        "surface-container-high": "#1f1f26",
        "surface-container-highest": "#25252d",
        "surface-bright": "#2c2b33",
        "on-surface": "#f9f5fd",
        "on-surface-variant": "#acaab1",
        primary: "#7C3AED",
        "primary-dim": "#6d28d9",
        "primary-container": "#b28cff",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#ffffff",
        accent: "#C084FC",
        secondary: "#F97316",
        "secondary-dim": "#F97316",
        "secondary-container": "#9d4300",
        "on-secondary": "#3b1500",
        "on-secondary-container": "#fff6f3",
        tertiary: "#c890ff",
        outline: "#76747b",
        "outline-variant": "#48474d",
        error: "#ff6e84",
        // Legacy compat
        "orbit-purple": "#7C3AED",
        border: "#48474d",
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
