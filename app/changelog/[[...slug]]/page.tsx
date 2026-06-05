/**
 * Smart catchall: handles both the landing list AND individual release entries.
 *
 * Installed at: app/changelog/[[...slug]]/page.tsx
 *
 * If no slug (URL is /changelog) → render the filterable list.
 * If slug present (URL is /changelog/foo) → render the corresponding MDX entry.
 */

import { changelogSource } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { mdxComponents } from '@/mdx-components';
import { ChangelogList, type ChangelogEntry, type Tag } from '@/components/ChangelogList';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug;

  // ─── Landing: render the filterable list ──────────────────────────────
  if (!slug || slug.length === 0) {
    const entries: ChangelogEntry[] = changelogSource
      .getPages()
      .map((p) => ({
        title: p.data.title,
        description: p.data.description ?? '',
        date: (p.data as any).date ?? '',
        tags: ((p.data as any).tags ?? []) as Tag[],
        url: p.url,
      }))
      .filter((e) => e.date) // skip pages without a date
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <DocsPage>
        <DocsTitle>Changelog</DocsTitle>
        <DocsDescription>
          Every update, improvement, and fix shipped to DataHawk.
        </DocsDescription>
        <DocsBody>
          <ChangelogList entries={entries} />
        </DocsBody>
      </DocsPage>
    );
  }

  // ─── Individual release: render the MDX page ──────────────────────────
  const page = changelogSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={mdxComponents} />
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
