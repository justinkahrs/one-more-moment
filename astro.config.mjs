// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import basicSsl from "@vitejs/plugin-basic-ssl";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [basicSsl(), tailwindcss()],
  },

  integrations: [mdx()],
  adapter: vercel(),
});