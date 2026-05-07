import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).default([]),
    created: z.coerce.string().optional(),
    updated: z.coerce.string().optional(),
  }),
});

export const collections = { notes };
