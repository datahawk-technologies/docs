"use client";

import { useEffect } from 'react';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    let sent = false;
    const report = () => {
      if (sent) return;
      sent = true;
      window.dispatchEvent(new CustomEvent('datahawk:user-visible-error', { detail: { code: 'docs_page_failed' } }));
    };
    if ((window as Window & { datahawkTelemetry?: { ready?: boolean } }).datahawkTelemetry?.ready) report();
    window.addEventListener('datahawk:telemetry-ready', report);
    return () => window.removeEventListener('datahawk:telemetry-ready', report);
  }, []);
  return <div role="alert"><h1>This page could not be loaded.</h1><button onClick={reset}>Try again</button></div>;
}
