import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        pageTitle: z.string().optional(),
        titleAr: z.string().optional(),
        excerpt: z.string(),
        excerptAr: z.string().optional(),
        date: z.coerce.date(),
        lang: z.enum(['en', 'ar', 'bi']),
        description: z.string().optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
        hidden: z.boolean().default(false),
    }),
});

export const collections = { blog };
