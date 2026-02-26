import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['gartengestaltung', 'naturstein', 'terrasse', 'pflaster', 'sichtschutz']),
    date: z.coerce.date(),
    heroImage: z.string(),
    images: z.array(z.string()),
    beforeAfter: z.array(z.object({
      before: z.string(),
      after: z.string(),
    })).optional(),
    featured: z.boolean().default(false),
    location: z.string(),
    duration: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    heroImage: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
