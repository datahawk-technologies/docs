import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

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

export default defineConfig();