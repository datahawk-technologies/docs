import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/* Shared navbar options used by docs and home layouts. */

import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src="/logo.svg" alt="DataHawk" width={28} height={28} />
          <span style={{ fontWeight: 600 }}>DataHawk</span>
        </>
      ),
      url: '/',
    },
    links: [
      {
        text: 'Documentation',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'API Reference',
        url: '/docs/api',
        active: 'nested-url',
      },
      {
        text: 'Dashboard',
        url: 'https://app.datahawk.co',
        external: true,
      },
    ],
  };
}