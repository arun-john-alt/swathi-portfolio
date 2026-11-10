// Astro settings. The site builds to plain HTML in dist/, which any static host can serve.
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Set this to the real address once the site has one (used for canonical and social links).
  // site: 'https://example.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
