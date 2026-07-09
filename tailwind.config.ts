import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        harbor: "#0b2533",
        lagoon: "#0f7688",
        foam: "#f4fbfb",
        signal: "#f97316",
        danger: "#dc2626"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(11, 37, 51, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;

