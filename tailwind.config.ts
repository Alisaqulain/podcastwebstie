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
          "gold-light": "#F5D27A",
          "gold-deep": "#A67C2E",
          dark: "#1A1A1A",
          cream: "#F5F1EB",
        },
        /** Premium white luxury — main #F9F7F4, sections #FFFFFF */
        luxury: {
          bg: "#F9F7F4",
          section: "#FFFFFF",
          heading: "#1A1A1A",
          body: "#4B5563",
          muted: "#9CA3AF",
          border: "#F1EAE0",
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
          "linear-gradient(135deg, #C9A14A 0%, #E8D5A3 42%, #F5D27A 100%)",
        "gold-shine":
          "linear-gradient(120deg, rgba(201,161,74,0.35) 0%, rgba(245,210,122,0.95) 50%, rgba(201,161,74,0.9) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(26, 26, 26, 0.06)",
        "soft-xl":
          "0 22px 44px -12px rgba(26, 26, 26, 0.07), 0 10px 24px -10px rgba(201, 161, 74, 0.05)",
        "gold-glow":
          "0 10px 32px -8px rgba(201, 161, 74, 0.35), 0 4px 12px rgba(201, 161, 74, 0.15)",
        "gold-glow-lg":
          "0 16px 44px -10px rgba(201, 161, 74, 0.32), 0 8px 20px rgba(201, 161, 74, 0.12)",
        card: "0 16px 40px -12px rgba(26, 26, 26, 0.08)",
        "luxury-card":
          "0 22px 44px -12px rgba(26, 26, 26, 0.07), 0 10px 24px -10px rgba(201, 161, 74, 0.05)",
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
