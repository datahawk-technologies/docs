/**
 * RSS feed endpoint for the DataHawk Incidents log.
 *
 * Installed at: app/incidents/feed.xml/route.ts
 * Accessible at: https://docs.datahawk.co/incidents/feed.xml
 *
 * Auto-includes every MDX file in content/incidents/ that has a `date` field
 * in its frontmatter, sorted newest-first. No manual maintenance - publishing
 * an incident publishes the feed item.
 *
 * Each item carries its status as a category, so a subscriber can filter or
 * alert on permanent data loss specifically. The
 * status, date range and datasets are also folded into the description, since
 * most readers only surface the description text.
 *
 * The feed is statically generated at build time. For dev mode, it's
 * regenerated on each request.
 */

import { incidentsSource } from '@/lib/source';

export const dynamic = 'force-static';
export const revalidate = false;

// Set your production URL here, or via NEXT_PUBLIC_SITE_URL env var
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://docs.datahawk.co';

const STATUS_LABEL: Record<string, string> = {
  'in-progress': 'In progress',
  'resolved-no-data-impact': 'Resolved (no data impact)',
  'resolved-data-unrecoverable': 'Resolved (data unrecoverable)',
};

export function GET() {
  const entries = incidentsSource
    .getPages()
    .map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      date: (p.data as any).date ?? '',
      dateRangeImpacted: (p.data as any).dateRangeImpacted ?? '',
      datasetsImpacted: ((p.data as any).datasetsImpacted ?? []) as string[],
      status: (p.data as any).status ?? 'resolved-no-data-impact',
      severity: (p.data as any).severity ?? 'minor',
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
    const status = STATUS_LABEL[e.status] ?? e.status;
    const category = e.status;

    const details = [
      e.description,
      `Severity: ${e.severity}.`,
      `Status: ${status}.`,
      e.dateRangeImpacted ? `Date range affected: ${e.dateRangeImpacted}.` : '',
      e.datasetsImpacted.length > 0
        ? `Datasets affected: ${e.datasetsImpacted.join(', ')}.`
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `
    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${SITE_URL}${e.url}</link>
      <guid isPermaLink="true">${SITE_URL}${e.url}</guid>
      <description>${escapeXml(details)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(category)}</category>
      <category>severity-${escapeXml(e.severity)}</category>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>DataHawk Incidents</title>
    <link>${SITE_URL}/incidents</link>
    <description>Incidents that affected DataHawk data, and whether the affected data could be recovered.</description>
    <language>en-us</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/incidents/feed.xml" rel="self" type="application/rss+xml" />
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
