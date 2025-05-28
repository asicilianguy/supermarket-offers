/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef9ff",
          100: "#d9f2ff",
          200: "#bae8ff",
          300: "#8adbff",
          400: "#52c6fc",
          500: "#2aabf7",
          600: "#1a8aea",
          700: "#1670d2",
          800: "#195baa",
          900: "#1a4d85",
          950: "#123053",
        },
        secondary: {
          50: "#f0f9f0",
          100: "#dcf1dd",
          200: "#bce3be",
          300: "#8ecd93",
          400: "#5db064",
          500: "#3e9246",
          600: "#2c7535",
          700: "#245d2c",
          800: "#214a27",
          900: "#1d3d23",
          950: "#0c2111",
        },
        accent: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdca8",
          300: "#ffc470",
          400: "#ffa337",
          500: "#ff8811",
          600: "#ff6b00",
          700: "#cc4e02",
          800: "#a13d0b",
          900: "#82340d",
          950: "#461804",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        hover: "0 10px 25px rgba(0, 0, 0, 0.1)",
        card: "0 10px 30px rgba(0, 0, 0, 0.08)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}
