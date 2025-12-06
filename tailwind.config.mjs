/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  darkMode: "class",
  plugins: [require("daisyui")],
  theme: {
    extend: {
      typography: {
        darkMode: null,
        sm: null,
        xl: null,
        "2xl": null,
      },
    },
  },
};
