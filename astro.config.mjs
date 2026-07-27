// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import basicSsl from "@vitejs/plugin-basic-ssl";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

const noindexRoutes = new Set(["/moment-request-thank-you/"]);

// https://astro.build/config
export default defineConfig({
  site: "https://www.onemoremoment.org",
  trailingSlash: "always",
  vite: {
    plugins: [basicSsl(), tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return !noindexRoutes.has(pathname);
      },
    }),
  ],
  adapter: vercel(),
});
