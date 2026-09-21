import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const CATEGORY_KEYS = ['cafe', 'stay', 'showroom', 'beauty', 'residence', 'commercial'] as const;

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(CATEGORY_KEYS),
    year: z.number().int(),
    location: z.string().optional(),
    summary: z.string(),
    cover: z.string().default('01.jpg'),
    featured: z.boolean().default(false),
    order: z.number().int(),
  }),
});

export const collections = { work };
