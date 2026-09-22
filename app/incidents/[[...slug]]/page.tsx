/**
 * Smart catchall: handles both the landing list AND individual incident entries.
 *
 * Installed at: app/incidents/[[...slug]]/page.tsx
 *
 * If no slug (URL is /incidents) → render the intro paragraph above the
 *   full incident list.
 * If slug present (URL is /incidents/foo) → render the corresponding MDX
 *   entry with its facts block, Older/Newer pager, and feedback widget.
 */

import { incidentsSource } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { join } from 'node:path';
import { mdxComponents } from '@/mdx-components';
import { IncidentsList, type IncidentEntry } from '@/components/IncidentsList';
import { IncidentFacts } from '@/components/IncidentFacts';
import { IncidentsPager } from '@/components/IncidentsPager';
import { PageFeedback } from '@/components/PageFeedback';
import { getLastModified } from '@/lib/git-last-modified';
import { Rss } from 'lucide-react';

// Shared helper — reads all dated entries from the incidents source.
function getDatedEntries() {
  return incidentsSource
    .getPages()
    .map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      date: (p.data as any).date ?? '',
      dateRangeImpacted: (p.data as any).dateRangeImpacted ?? '',
      datasetsImpacted: ((p.data as any).datasetsImpacted ?? []) as string[],
      status: ((p.data as any).status ?? 'resolved-no-data-impact') as IncidentEntry['status'],
      severity: ((p.data as any).severity ?? 'minor') as IncidentEntry['severity'],
      url: p.url,
    }))
    .filter((e) => e.date);
}

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug;

  // ─── Landing: intro + full incident list ───────────────────────────────
  if (!slug || slug.length === 0) {
    const entries: IncidentEntry[] = getDatedEntries().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return (
      <DocsPage>
        <DocsTitle>Incidents</DocsTitle>
        <DocsDescription>
          A history of incidents that affected DataHawk data, what they
          affected, and where each one stands.
        </DocsDescription>
        <DocsBody>
          <p>
            We log every incident that affects the data you rely on here, as
            soon as we can confirm the impact. Each entry says which datasets
            and date range were affected, how severe it was, and where the
            incident stands.
          </p>
          <p className="not-prose mb-8">
            <a
              href="/incidents/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary no-underline hover:underline"
            >
              <Rss className="size-4 shrink-0" />
              Subscribe to incident updates via RSS
            </a>
          </p>
          <IncidentsList entries={entries} />
        </DocsBody>
      </DocsPage>
    );
  }

  // ─── Individual incident: facts block + MDX body + pager ───────────────
  const page = incidentsSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const allEntries = getDatedEntries();
  const dateRangeImpacted = (page.data as any).dateRangeImpacted ?? '';
  const datasetsImpacted = ((page.data as any).datasetsImpacted ?? []) as string[];
  const status = (page.data as any).status ?? 'resolved-no-data-impact';
  const severity = (page.data as any).severity ?? 'minor';

  // Prefer the published `date` over the last git commit, same reasoning as
  // changelog entries: a typo fix shouldn't make an old incident look fresh.
  const filePath = join(process.cwd(), 'content/incidents', (page as any).file?.path ?? '');
  const lastUpdated = (page.data as any).date || getLastModified(filePath);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <IncidentFacts
          dateRangeImpacted={dateRangeImpacted}
          datasetsImpacted={datasetsImpacted}
          status={status}
          severity={severity}
        />
        <MDX components={mdxComponents} />
        <IncidentsPager currentUrl={page.url} allEntries={allEntries} />
        <PageFeedback lastUpdated={lastUpdated} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return incidentsSource.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug;

  if (!slug || slug.length === 0) {
    return {
      title: 'Incidents | DataHawk Docs',
      description:
        'A history of incidents that affected DataHawk data, what they affected, and where each one stands.',
    };
  }

  const page = incidentsSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
