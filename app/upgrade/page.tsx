import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export const metadata: Metadata = {
  title: 'Upgrade | DataHawk',
  robots: { index: false, follow: false },
};

export default function UpgradePage() {
  return <HomeLayout {...baseOptions()}>{null}</HomeLayout>;
}
