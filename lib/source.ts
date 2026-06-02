import { loader } from 'fumadocs-core/source';
import { welcome, helpCenter, troubleshooting, apiReference } from '@/.source/server';
import type { LoaderOutput, PageData } from 'fumadocs-core/source';

export const welcomeSource = loader({
  baseUrl: '/welcome',
  source: welcome.toFumadocsSource(),
});

export const helpCenterSource = loader({
  baseUrl: '/help-center',
  source: helpCenter.toFumadocsSource(),
});

export const troubleshootingSource = loader({
  baseUrl: '/troubleshooting',
  source: troubleshooting.toFumadocsSource(),
});

export const apiReferenceSource = loader({
  baseUrl: '/api-reference',
  source: apiReference.toFumadocsSource(),
});

const sectionSources = [
  welcomeSource,
  helpCenterSource,
  troubleshootingSource,
  apiReferenceSource,
] as const;

function getPageByUrl(url: string) {
  return sectionSources
    .flatMap((sectionSource) => sectionSource.getPages())
    .find((page) => page.url === url);
}

function getUrlSegments(page: { url: string }) {
  return page.url.split('/').filter(Boolean);
}

const aggregateSource = {
  pageTree: {
    name: 'DataHawk Docs',
    children: sectionSources.flatMap((sectionSource) => sectionSource.pageTree.children),
  } satisfies LoaderOutput['pageTree'],
  getPageTree() {
    return this.pageTree;
  },
  getPages() {
    return sectionSources.flatMap((sectionSource) => sectionSource.getPages());
  },
  getLanguages() {
    return [];
  },
  getPage(slugs: string[] | undefined) {
    const url = `/${slugs?.join('/') ?? ''}`;

    return getPageByUrl(url);
  },
  getNodePage(node: { type: string; url?: string }) {
    if (node.type !== 'page' || !node.url) return;

    return getPageByUrl(node.url);
  },
  getNodeMeta() {
    return;
  },
  generateParams<TSlug extends string = 'slug', TLang extends string = 'lang'>(
    slug = 'slug' as TSlug,
    lang = 'lang' as TLang,
  ) {
    return this.getPages().map((page) => ({
      [slug]: getUrlSegments(page),
      [lang]: page.locale,
    })) as (Record<TSlug, string[]> & Record<TLang, string>)[];
  },
};

export const source = aggregateSource as unknown as LoaderOutput;

export function getPageMarkdownUrl(page: { url: string }) {
  return {
    pathname: `/llms.mdx/docs/${getUrlSegments(page).join('/')}/content.md`,
    segments: [...getUrlSegments(page), 'content.md'],
  };
}

export function getPageImage(page: { url: string }) {
  return {
    pathname: `/og/docs/${getUrlSegments(page).join('/')}/image.png`,
    segments: [...getUrlSegments(page), 'image.png'],
  };
}

export async function getLLMText(page: { data: PageData }) {
  const data = page.data as PageData & {
    getText?: (type: 'raw' | 'processed') => Promise<string>;
  };

  if (!data.getText) return '';

  try {
    return await data.getText('processed');
  } catch {
    return data.getText('raw');
  }
}
