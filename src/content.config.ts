// One folder per project in src/content/work/<project>/, holding index.md and (later) its two images.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/work',
    // The folder name becomes the page address: work/<folder>/
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      type: z.string(), // e.g. "Shopify store" or "Static website"
      year: z.string().optional(),
      role: z.string().optional(),
      summary: z.string(),
      live: z.string().default(''), // the live site's address; empty shows a placeholder link
      design: image().optional(), // design.png next to index.md (with live.png: the design/live slider)
      liveShot: image().optional(), // live.png next to index.md
      desktop: image().optional(), // desktop.png: the live site at 1440 × 900
      phone: image().optional(), // phone.png: the live site at 390 × 844
      placeholder: z.boolean().default(false), // true shows a "Placeholder" tag
    }),
});

export const collections = { work };
