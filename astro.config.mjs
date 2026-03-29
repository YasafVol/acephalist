import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
  site: "https://acephalist.netlify.app",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/share/"),
    }),
    solidJs(),
    tailwind({ applyBaseStyles: false }),
  ],
})