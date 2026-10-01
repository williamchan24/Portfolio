/**
 * Content collections = Astro's way of turning a folder of Markdown files into typed data.
 * Every file in src/content/projects/ becomes one project. The `schema` below checks each
 * file's frontmatter (the bit between the --- lines) when you build, so typos get caught.
 * Docs: https://docs.astro.build/en/guides/content-collections/
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tech: z.array(z.string()).default([]),
      // image() = a path to an image next to the .md file. Astro resizes + compresses it for you.
      image: image().optional(),
      live: z.url().optional(),
      repo: z.url().optional(),
      order: z.number().default(0), // lower numbers show first
      draft: z.boolean().default(false), // true = hidden from the site
    }),
});

export const collections = { projects };
