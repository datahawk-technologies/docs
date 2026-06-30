import { createMDX } from 'fumadocs-mdx/next';
import { notionRedirects } from './lib/notion-redirects.mjs';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    const internalRedirects = [
      { source: '/troubleshooting/i-cannot-see-data-in-manufacturing-views,-but-i-see-it-in-sourcing', destination: '/troubleshooting/data-discrepancies/manufacturing-vs-sourcing-views', permanent: true },
      { source: '/troubleshooting/data-discrepancies/i-cannot-see-data-in-manufacturing-views,-but-i-see-it-in-sourcing', destination: '/troubleshooting/data-discrepancies/manufacturing-vs-sourcing-views', permanent: true },
      { source: "/troubleshooting/i-don't-see-data-after-connecting-my-dsp-account", destination: '/troubleshooting/connection-failures/no-data-after-dsp-connect', permanent: true },
      { source: "/troubleshooting/connection-failures/i-don't-see-data-after-connecting-my-dsp-account", destination: '/troubleshooting/connection-failures/no-data-after-dsp-connect', permanent: true },
      { source: "/troubleshooting/i-don't-see-traffic-data-for-my-asin", destination: '/troubleshooting/data-not-refreshing/no-traffic-data-for-asin', permanent: true },
      { source: "/troubleshooting/data-not-refreshing/i-don't-see-traffic-data-for-my-asin", destination: '/troubleshooting/data-not-refreshing/no-traffic-data-for-asin', permanent: true },
      { source: '/troubleshooting/ads-data-appearing-under-the-wrong-account-type', destination: '/troubleshooting/data-discrepancies/ads-data-appearing-under-the-wrong-account-type', permanent: true },
      { source: '/troubleshooting/i-want-to-restrict-datahawk-access-to-specific-dsp-profiles', destination: '/troubleshooting/access-permissions/i-want-to-restrict-datahawk-access-to-specific-dsp-profiles', permanent: true },
      { source: '/troubleshooting/accessing-our-snowflake-database-from-behind-a-firewall', destination: '/troubleshooting/connection-failures/accessing-our-snowflake-database-from-behind-a-firewall', permanent: true },
      { source: '/troubleshooting/my-advertising-data-is-not-populating', destination: '/troubleshooting/data-not-refreshing/my-advertising-data-is-not-populating', permanent: true },
      { source: '/help-center/powerbi-dashboards', destination: '/help-center/dashboard-templates/power-bi', permanent: true },
      { source: '/help-center/powerbi-dashboards/:path*', destination: '/help-center/dashboard-templates/power-bi/:path*', permanent: true },
      { source: '/help-center/looker-studio', destination: '/help-center/dashboard-templates/looker-studio', permanent: true },
      { source: '/help-center/looker-studio/:path*', destination: '/help-center/dashboard-templates/looker-studio/:path*', permanent: true },
      { source: '/help-center/knowledge-hub', destination: '/help-center/data-metrics-guides', permanent: true },
      { source: '/help-center/knowledge-hub/glossary', destination: '/help-center/glossary', permanent: true },
      { source: '/help-center/knowledge-hub/data-fundamentals', destination: '/help-center/data-metrics-guides', permanent: true },
      { source: '/help-center/knowledge-hub/metrics-methodology', destination: '/help-center/data-metrics-guides', permanent: true },
      { source: '/help-center/knowledge-hub/dataset-reference', destination: '/help-center/data-reference', permanent: true },
      { source: '/help-center/knowledge-hub/daily-exchange-rate-dataset', destination: '/help-center/data-reference/daily-exchange-rate-dataset', permanent: true },
      { source: '/help-center/knowledge-hub/datasets-models-2', destination: '/help-center/data-reference', permanent: true },
      { source: '/help-center/knowledge-hub/datasets-models', destination: '/help-center/data-reference/find-tables-and-columns', permanent: true },
      { source: '/help-center/knowledge-hub/amz-ads-models', destination: '/help-center/data-reference/amazon-advertising-data', permanent: true },
      { source: '/help-center/knowledge-hub/amz-brand-analytics-data', destination: '/help-center/data-reference/amz-brand-analytics-data', permanent: true },
      { source: '/help-center/knowledge-hub/amz-datahawk-reports', destination: '/help-center/data-reference/amz-datahawk-reports', permanent: true },
      { source: '/help-center/knowledge-hub/amz-inventory-data', destination: '/help-center/data-reference/amz-inventory-data', permanent: true },
      { source: '/help-center/knowledge-hub/amz-removal-data', destination: '/help-center/data-reference/amz-removal-data', permanent: true },
      { source: '/help-center/knowledge-hub/amz-replenishment', destination: '/help-center/data-metrics-guides/subscribe-save-performance-forecast', permanent: true },
      { source: '/help-center/knowledge-hub/amz-returns-data', destination: '/help-center/data-reference/amz-returns-data', permanent: true },
      { source: '/help-center/knowledge-hub/amz-seller-profit-data', destination: '/help-center/data-reference/amz-seller-profit-data', permanent: true },
      { source: '/help-center/knowledge-hub/wmt-advertising-data', destination: '/help-center/data-reference/wmt-advertising-data', permanent: true },
      { source: '/help-center/knowledge-hub/convert-currencies', destination: '/help-center/data-reference/convert-currencies', permanent: true },
      { source: '/help-center/knowledge-hub/data-fundamentals/:path*', destination: '/help-center/data-metrics-guides/:path*', permanent: true },
      { source: '/help-center/knowledge-hub/metrics-methodology/:path*', destination: '/help-center/data-metrics-guides/:path*', permanent: true },
      { source: '/help-center/knowledge-hub/dataset-reference/:path*', destination: '/help-center/data-reference/:path*', permanent: true },
      { source: '/help-center/knowledge-hub/keyword-search-volume', destination: '/help-center/data-metrics-guides/keyword-research', permanent: true },
      { source: '/help-center/knowledge-hub/:path*', destination: '/help-center/data-metrics-guides/:path*', permanent: true },
      { source: '/help-center/data-metrics-guides/amz-seller-profit-read-reports', destination: '/help-center/data-metrics-guides/profit-and-loss', permanent: true },
      { source: '/help-center/data-metrics-guides/keyword-search-volume', destination: '/help-center/data-metrics-guides/keyword-research', permanent: true },
      { source: '/help-center/modules/insights', destination: '/changelog/2026-06-30-insights-module-retired', permanent: true },
      { source: '/help-center/modules/insights/:path*', destination: '/changelog/2026-06-30-insights-module-retired', permanent: true },
    ];

    // Toggle via env var — set ENABLE_NOTION_REDIRECTS=true on Vercel when
    // ready to flip the DNS cutover from the legacy Notion-hosted docs site.
    const notionRedirectEntries =
      process.env.ENABLE_NOTION_REDIRECTS === 'true'
        ? notionRedirects.map(({ from, to }) => ({
            source: from,
            destination: to,
            permanent: true,
          }))
        : [];

    return [...internalRedirects, ...notionRedirectEntries];
  },
};

export default withMDX(config);
