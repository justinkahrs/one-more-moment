// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import basicSsl from "@vitejs/plugin-basic-ssl";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://onemoremoment.org",
  vite: {
    plugins: [basicSsl(), tailwindcss()],
  },

  integrations: [mdx(), sitemap()],
  adapter: vercel(),
});