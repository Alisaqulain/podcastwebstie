import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#C9A14A",
          "gold-light": "#E8D5A3",
          "gold-deep": "#A67C2E",
          dark: "#1A1A1A",
          cream: "#F5F1EB",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #E8D5A3 0%, #C9A14A 45%, #A67C2E 100%)",
        "gold-shine":
          "linear-gradient(120deg, rgba(232,213,163,0.35) 0%, rgba(201,161,74,0.9) 50%, rgba(166,124,46,0.95) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(26, 26, 26, 0.08)",
        "gold-glow": "0 0 48px rgba(201, 161, 74, 0.28)",
        card: "0 20px 50px rgba(26, 26, 26, 0.06)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
