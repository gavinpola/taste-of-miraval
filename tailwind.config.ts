import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5EDE3",
        sand: "#D4A574",
        terracotta: "#C75B39",
        sage: "#7A8B6F",
        "desert-night": "#1A1412",
        sky: "#A8BEC7",
        "sunset-gold": "#D4956A",
        dust: "#B8A99A",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "breathe": "breathe 6s ease-in-out infinite",
        "fade-in": "fadeIn 1.5s ease-out forwards",
        "fade-in-slow": "fadeIn 3s ease-out forwards",
        "float": "float 8s ease-in-out infinite",
        "dust-drift": "dustDrift 20s linear infinite",
        "pulse-gentle": "pulseGentle 4s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        dustDrift: {
          "0%": { transform: "translateX(-100%) translateY(0)" },
          "100%": { transform: "translateX(100vw) translateY(-50px)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
