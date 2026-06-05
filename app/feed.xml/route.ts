/**
 * RSS feed endpoint for the DataHawk Changelog.
 *
 * Installed at: app/feed.xml/route.ts
 * Accessible at: https://your-site.com/feed.xml
 *
 * Auto-includes every MDX file in content/changelog/ that has a `date` field
 * in its frontmatter, sorted newest-first. No manual maintenance.
 *
 * The feed is statically generated at build time. For dev mode, it's
 * regenerated on each request.
 */

import { changelogSource } from '@/lib/source';

export const dynamic = 'force-static';
export const revalidate = false;

// Set your production URL here, or via NEXT_PUBLIC_SITE_URL env var
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://docs.datahawk.co';

export function GET() {
  const entries = changelogSource
    .getPages()
    .map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      date: (p.data as any).date ?? '',
      tags: ((p.data as any).tags ?? []) as string[],
      url: p.url,
    }))
    .filter((e) => e.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const buildDate = new Date().toUTCString();
  const latestDate = entries.length > 0
    ? new Date(entries[0].date).toUTCString()
    : buildDate;

  const items = entries.map((e) => {
    const pubDate = new Date(e.date).toUTCString();
    const categories = e.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('');
    return `
    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${SITE_URL}${e.url}</link>
      <guid isPermaLink="true">${SITE_URL}${e.url}</guid>
      <description>${escapeXml(e.description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${categories}
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>DataHawk Changelog</title>
    <link>${SITE_URL}/changelog</link>
    <description>Every update, improvement, and fix shipped to DataHawk.</description>
    <language>en-us</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
