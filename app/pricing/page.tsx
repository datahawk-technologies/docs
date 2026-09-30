import { createElement } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export const metadata: Metadata = {
  title: 'Pricing | DataHawk',
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="afterInteractive" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {createElement('stripe-pricing-table', {
          'pricing-table-id': 'prctbl_1TvhOcKZj5mTCQv9tPSbAhny',
          'publishable-key':
            'pk_live_51MWMWtKZj5mTCQv91cOg9FxRfWaxWwO7QNXDG8HQcI7vOZYVLcIo0YKohqJRWEGZIGTaftPQM9huxOqZj3wAoObk00wya9SxL7',
        })}
      </div>
    </HomeLayout>
  );
}
