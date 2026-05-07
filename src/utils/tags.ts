import { getCollection } from 'astro:content';

export async function getAllTags(): Promise<Map<string, number>> {
  const notes = await getCollection('notes');
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const tag of note.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}

export async function getNotesByTag(tag: string) {
  const notes = await getCollection('notes');
  return notes.filter(note => note.data.tags.includes(tag));
}
