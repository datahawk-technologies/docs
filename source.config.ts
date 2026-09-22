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

export const incidents = defineDocs({
  dir: 'content/incidents',
  docs: {
  schema: frontmatterSchema.extend({
    date: z.coerce.string(),
    // Set only when a published entry is materially revised - most often when an
    // in-progress incident closes. Drives the RSS pubDate so subscribers see the
    // update, while the filename (and therefore the URL and the feed GUID) stays
    // frozen. Never rename a published entry to carry a new date.
    updated: z.string().optional(),
    dateRangeImpacted: z.string(),
    datasetsImpacted: z.array(z.string()),
    status: z.enum(['in-progress', 'resolved-no-data-impact', 'resolved-data-unrecoverable']),
    severity: z.enum(['low', 'minor', 'major']),
  }),
  },
});

export default defineConfig();
