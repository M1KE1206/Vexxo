import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orbit: {
          purple: "#7C6CF6",
        },
        background: "#080810",
        surface: "#0F0F1C",
        border: "#1C1C30",
        text: {
          primary: "#F0EEF8",
          muted: "#6B63B5",
        },
      },
      fontFamily: {
        sans: ["var(--font-urbanist)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "orbit-glow": "0 0 40px rgba(124, 108, 246, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
