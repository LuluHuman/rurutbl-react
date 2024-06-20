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
        "primary-color": "var(--bg-primary)",
        "secondary-color": "var(--bg-secondary)",
        "menu-color": "var(--bg-menu)"
      },
    },
  },
  plugins: [],
};
export default config