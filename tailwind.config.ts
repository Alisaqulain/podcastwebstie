import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
          red: "#E11D48",
          dark: "#1A1A1A",
          cream: "#F5F1EB",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
        },
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        luxury: {
          bg: "var(--luxury-bg)",
          section: "var(--luxury-section)",
          heading: "var(--luxury-heading)",
          body: "var(--luxury-body)",
          muted: "var(--luxury-muted)",
          border: "var(--luxury-border)",
        },
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
        "section-mesh":
          "radial-gradient(1200px 600px at 10% 0%, rgba(201,161,74,0.08), transparent 55%), radial-gradient(900px 500px at 90% 20%, rgba(37,99,235,0.04), transparent 50%), linear-gradient(180deg, var(--surface) 0%, var(--luxury-bg) 100%)",
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
        "soft-xl": "var(--glass-shadow)",
        "gold-glow":
          "0 10px 32px -8px rgba(201, 161, 74, 0.35), 0 4px 12px rgba(201, 161, 74, 0.15)",
        "gold-glow-lg":
          "0 16px 44px -10px rgba(201, 161, 74, 0.32), 0 8px 20px rgba(201, 161, 74, 0.12)",
        card: "var(--glass-shadow)",
        "luxury-card": "var(--glass-shadow)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionDuration: {
        theme: "350ms",
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
