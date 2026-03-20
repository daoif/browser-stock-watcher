import type { Config } from "tailwindcss"

export default {
  content: [
    "./entrypoints/**/*.{html,ts}",
    "./src/**/*.{vue,ts}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        soft: "#475569",
        line: "#e2e8f0",
        paper: "#ffffff",
        muted: "#f8fafc",
        success: "#166534",
        warning: "#92400e",
        danger: "#b91c1c",
      },
      boxShadow: {
        panel: "0 18px 48px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config
