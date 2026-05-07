import { getCollection } from 'astro:content';

const WIKI_LINK_RE = /\[\[([^\]]+)\]\]/g;

export function parseLinks(content: string): string[] {
  const links: string[] = [];
  let match;
  const re = new RegExp(WIKI_LINK_RE.source, 'g');
  while ((match = re.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  return [...new Set(links)];
}

export async function buildBacklinkMap(): Promise<Map<string, string[]>> {
  const notes = await getCollection('notes');
  const map = new Map<string, string[]>();

  for (const note of notes) {
    for (const slug of parseLinks(note.body)) {
      const existing = map.get(slug) ?? [];
      map.set(slug, [...existing, note.slug]);
    }
  }

  return map;
}

export async function getBacklinks(slug: string): Promise<string[]> {
  const map = await buildBacklinkMap();
  return map.get(slug) ?? [];
}
