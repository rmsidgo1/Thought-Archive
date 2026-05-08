import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { readdirSync } from 'fs';
import { basename } from 'path';
import { remarkWikiLinks } from './src/utils/remark-wiki-links.mjs';
import { remarkCallouts } from './src/utils/remark-callouts.mjs';

const BASE = '/Thought-Archive';

// 빌드 시점에 존재하는 slug 목록 — 깨진 링크 감지에 사용
const existingSlugs = new Set(
  readdirSync('./src/content/notes')
    .filter(f => f.endsWith('.md'))
    .map(f => basename(f, '.md'))
);

export default defineConfig({
  integrations: [tailwind()],
  base: BASE,
  site: 'https://rmsidgo1.github.io',
  markdown: {
    remarkPlugins: [
      [remarkWikiLinks, { base: BASE, existingSlugs }],
      remarkCallouts,
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
