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
        "menu-color": "var(--bg-menu)",
      },
      maxWidth: {
        "pbsize": "var(--pb-size)"
      },

      maxHeight: {
        "pbsize": "var(--pb-size)"
      }
    },
  },
  plugins: [],
};
export default config