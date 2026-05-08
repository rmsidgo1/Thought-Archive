import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).default([]),
    type: z.enum(['problem-solving', 'insight', 'learning', 'reference']).optional(),
    created: z.coerce.string().optional(),
    updated: z.coerce.string().optional(),
  }),
});

export const collections = { notes };
