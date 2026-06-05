import { loader } from 'fumadocs-core/source';
import { welcome, helpCenter, troubleshooting, apiReference, changelog } from '@/.source/server';
import type { PageData } from 'fumadocs-core/source';

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

export const changelogSource = loader({
  baseUrl: '/changelog',
  source: changelog.toFumadocsSource(),
});

function getUrlSegments(page: { url: string }) {
  return page.url.split('/').filter(Boolean);
}

export const source = loader({
  baseUrl: '/',
  source: {
    welcome: welcome.toFumadocsSource({
      baseDir: 'welcome',
    }),
    helpCenter: helpCenter.toFumadocsSource({
      baseDir: 'help-center',
    }),
    troubleshooting: troubleshooting.toFumadocsSource({
      baseDir: 'troubleshooting',
    }),
    apiReference: apiReference.toFumadocsSource({
      baseDir: 'api-reference',
    }),
    changelog: changelog.toFumadocsSource({
      baseDir: 'changelog',
    }),
  },
});

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
