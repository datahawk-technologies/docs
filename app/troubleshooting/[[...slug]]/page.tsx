import { troubleshootingSource } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { join } from 'node:path';
import { mdxComponents } from '@/mdx-components';
import { PageFeedback } from '@/components/PageFeedback';
import { getLastModified } from '@/lib/git-last-modified';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = troubleshootingSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const filePath = join(process.cwd(), 'content/troubleshooting', (page as any).file?.path ?? '');
  const lastUpdated = getLastModified(filePath);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={mdxComponents} />
        <PageFeedback lastUpdated={lastUpdated} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return troubleshootingSource.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = troubleshootingSource.getPage(params.slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}