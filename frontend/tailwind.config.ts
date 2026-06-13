import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        edge: "var(--edge)",
        edgeBright: "var(--edge-bright)",
        ink: "var(--text)",
        inkDim: "var(--text-dim)",
        inkFaint: "var(--text-faint)",
        accent: "var(--accent)",
        accentStrong: "var(--accent-strong)",
        accentWhisper: "var(--accent-whisper)",
        danger: "var(--danger)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      letterSpacing: {
        widest: "0.24em",
      },
    },
  },
  plugins: [],
};

export default config;
