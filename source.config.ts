import { z } from 'zod';
import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';

export const welcome = defineDocs({
  dir: 'content/welcome',
});

export const helpCenter = defineDocs({
  dir: 'content/help-center',
});

export const troubleshooting = defineDocs({
  dir: 'content/troubleshooting',
});

export const apiReference = defineDocs({
  dir: 'content/api-reference',
});

export const changelog = defineDocs({
  dir: 'content/changelog',
  docs: {
  schema: frontmatterSchema.extend({
    date: z.coerce.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  },
});

export default defineConfig();
