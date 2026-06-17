import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout as DefaultCallout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Term } from '@/components/Term';
import { PageFeedback } from '@/components/PageFeedback';

// ─── Callout: emoji icon override ──────────────────────────────────────────
type CalloutType = 'info' | 'warn' | 'warning' | 'error' | 'success';

const defaultIcons: Record<CalloutType, ReactNode> = {
  info: <span className="text-xl leading-none">💡</span>,
  warn: <span className="text-xl leading-none">⚠️</span>,
  warning: <span className="text-xl leading-none">⚠️</span>,
  error: <span className="text-xl leading-none">❌</span>,
  success: <span className="text-xl leading-none">✅</span>,
};

function Callout({
  type = 'info',
  icon,
  ...props
}: {
  type?: CalloutType;
  icon?: ReactNode;
  children?: ReactNode;
  title?: string;
}) {
  return (
    <DefaultCallout
      type={type}
      icon={icon ?? defaultIcons[type]}
      {...props}
    />
  );
}

// ─── Global MDX component registry ─────────────────────────────────────────
export const mdxComponents = {
  ...defaultMdxComponents,

  // Custom-overridden
  Callout,
  Term,

  // Layout & structure
  Card,
  Cards,
  Step,
  Steps,
  Accordion,
  Accordions,
  Tab,
  Tabs,

  // File trees, API tables, page TOC
  File,
  Files,
  Folder,
  TypeTable,
  InlineTOC,

    // Optimized images
  Image,

  // Per-page feedback widget (last updated + 'was this helpful?')
  PageFeedback,
};