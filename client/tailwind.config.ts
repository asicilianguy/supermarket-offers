import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        secondary: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
          950: "#4a044e",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        dark: {
          // Questa era la tua palette 'dark', l'ho lasciata ma considera che shadcn/ui gestirà i colori base
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        // shadcn/ui aggiungerà 'lg', 'md', 'sm' se usi lo stile New York
      },
      boxShadow: {
        // ... le tue boxShadow personalizzate ...
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        hover: "0 10px 25px rgba(0, 0, 0, 0.1)",
        card: "0 10px 30px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 15px 35px rgba(0, 0, 0, 0.12)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        "stack-1": "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "stack-2": "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        "stack-3": "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        "dark-card": "0 10px 30px rgba(0, 0, 0, 0.2)",
        "dark-hover": "0 15px 35px rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        // shadcn/ui aggiungerà le sue keyframes per accordion, ecc.
        // ... le tue keyframes personalizzate ...
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        // ... altre ...
      },
      animation: {
        // shadcn/ui aggiungerà le sue animazioni
        // ... le tue animazioni personalizzate ...
        float: "float 6s ease-in-out infinite",
        // ... altre ...
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // shadcn/ui aggiungerà questo plugin
}

export default config
