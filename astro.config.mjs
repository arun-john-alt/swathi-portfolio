// Astro settings. The site builds to plain HTML in dist/, which any static host can serve.
// It is hosted on GitHub Pages at https://arun-john-alt.github.io/swathi-portfolio/
// (a project site, so every page lives under /swathi-portfolio/: that is what `base` is for).
// With a custom domain later, set `site` to it and remove `base`.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://arun-john-alt.github.io',
  base: '/swathi-portfolio',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
