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
