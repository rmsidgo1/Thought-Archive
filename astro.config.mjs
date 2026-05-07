import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { remarkWikiLinks } from './src/utils/remark-wiki-links.mjs';

const BASE = '/Thought-Archive';

export default defineConfig({
  integrations: [tailwind()],
  base: BASE,
  site: 'https://rmsidgo1.github.io',
  markdown: {
    remarkPlugins: [[remarkWikiLinks, { base: BASE }]],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
