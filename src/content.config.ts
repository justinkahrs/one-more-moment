import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    authorRole: z.string().optional(),
    reviewer: z.string().optional(),
    reviewerRole: z.string().optional(),
    draft: z.boolean().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
