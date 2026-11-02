import Script from 'next/script';

export function PostHog() {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!token || !host) return null;
  const config = JSON.stringify({ token, host, application: 'docs', enabled: process.env.NODE_ENV === 'production' }).replace(/</g, '\\u003c');
  return <>
    <Script id="posthog-config" strategy="beforeInteractive">{`window.__DATAHAWK_POSTHOG__ = ${config};`}</Script>
    <Script src="/datahawk-telemetry.js" strategy="afterInteractive" />
  </>;
}
