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
        "bg": "var(--md-sys-color-background)",
        "primary-color": "var(--md-sys-color-primary)",
        "on-primary-color": "var(--md-sys-color-on-primary)",
        "secondary-color": "var(--md-sys-color-secondary)",
        "on-secondary-color": "var(--md-sys-color-on-secondary)",
        "secondary-container": "var(--md-sys-color-secondary-container)",
        "grey": "var(--color-grey)",
      },
      borderColor: {
        "grey": "var(--color-grey)",
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