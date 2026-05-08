import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { remarkWikiLinks } from './src/utils/remark-wiki-links.mjs';
import { remarkCallouts } from './src/utils/remark-callouts.mjs';

const BASE = '/Thought-Archive';

export default defineConfig({
  integrations: [tailwind()],
  base: BASE,
  site: 'https://rmsidgo1.github.io',
  markdown: {
    remarkPlugins: [[remarkWikiLinks, { base: BASE }], remarkCallouts],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
