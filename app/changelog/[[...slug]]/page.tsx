/**
 * Smart catchall: handles both the landing list AND individual release entries.
 *
 * Installed at: app/changelog/[[...slug]]/page.tsx
 *
 * If no slug (URL is /changelog) → render the slim subscribe banner above
 *   the filterable list. The banner is collapsed by default — just one line.
 * If slug present (URL is /changelog/foo) → render the corresponding MDX entry
 *   with Older/Newer pager at the bottom.
 */

import { changelogSource } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { join } from 'node:path';
import { mdxComponents } from '@/mdx-components';
import { ChangelogList, type ChangelogEntry, type Tag } from '@/components/ChangelogList';
import { ChangelogPager } from '@/components/ChangelogPager';
import { SubscribeForm } from '@/components/SubscribeForm';
import { PageFeedback } from '@/components/PageFeedback';
import { getLastModified } from '@/lib/git-last-modified';

// Shared helper — reads all dated entries from the changelog source.
function getDatedEntries() {
  return changelogSource
    .getPages()
    .map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      date: (p.data as any).date ?? '',
      tags: ((p.data as any).tags ?? []) as Tag[],
      url: p.url,
    }))
    .filter((e) => e.date);
}

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug;

  // ─── Landing: slim subscribe banner + filterable list ─────────────────
  if (!slug || slug.length === 0) {
    const entries: ChangelogEntry[] = getDatedEntries().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return (
      <DocsPage>
        <DocsTitle>Changelog</DocsTitle>
        <DocsDescription>
          Every update, improvement, and fix shipped to DataHawk.
        </DocsDescription>
        <DocsBody>
          <SubscribeForm />
          <ChangelogList entries={entries} />
        </DocsBody>
      </DocsPage>
    );
  }

  // ─── Individual release: render the MDX page + pager ───────────────────
  const page = changelogSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const allEntries = getDatedEntries();
  // For changelog entries, prefer the published `date` over the last git
  // commit — typo fixes shouldn't make a 6-month-old release look fresh.
  const filePath = join(process.cwd(), 'content/changelog', (page as any).file?.path ?? '');
  const lastUpdated = (page.data as any).date || getLastModified(filePath);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={mdxComponents} />
        <ChangelogPager currentUrl={page.url} allEntries={allEntries} />
        <PageFeedback lastUpdated={lastUpdated} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return changelogSource.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug;

  if (!slug || slug.length === 0) {
    return {
      title: 'Changelog | DataHawk Docs',
      description: 'Every update, improvement, and fix shipped to DataHawk.',
    };
  }

  const page = changelogSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
