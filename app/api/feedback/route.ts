/**
 * POST /api/feedback
 *
 * Fans a single feedback event out to two destinations:
 *   1. Slack #docs-gaps — only on 👎 (low-noise channel for things to fix)
 *   2. PostHog — every vote, including 👍 (queryable analytics over time)
 *
 * Client payload: { rating: 'up'|'down', page: string, comment?: string }
 *
 * Returns 200 ok=true even if downstream dispatches fail — failures are
 * logged server-side. Feedback collection is non-critical; we never want
 * the visitor's browser to show an error toast because PostHog is down.
 *
 * Required env vars (see .env.local.example):
 *   SLACK_FEEDBACK_WEBHOOK_URL  — Incoming Webhook pointing at #docs-gaps
 *   POSTHOG_API_KEY             — server-side project API key
 *   POSTHOG_HOST                — optional, defaults to https://eu.i.posthog.com
 */

import { NextRequest, NextResponse } from 'next/server';

type FeedbackPayload = {
  rating: 'up' | 'down';
  page: string;
  comment?: string;
};

const SITE_ORIGIN = 'https://docs.datahawk.co';
const DEFAULT_POSTHOG_HOST = 'https://eu.i.posthog.com';

export async function POST(req: NextRequest) {
  let body: FeedbackPayload;
  try {
    body = (await req.json()) as FeedbackPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const { rating, page, comment } = body;
  if (rating !== 'up' && rating !== 'down') {
    return NextResponse.json({ ok: false, error: 'invalid rating' }, { status: 400 });
  }
  if (typeof page !== 'string' || !page.startsWith('/')) {
    return NextResponse.json({ ok: false, error: 'invalid page' }, { status: 400 });
  }
  // Truncate comment defensively — Slack message limits are generous, but
  // we don't want pasted novels.
  const trimmedComment = comment?.slice(0, 1000);

  const results = await Promise.allSettled([
    sendToPostHog({ rating, page, comment: trimmedComment }),
    rating === 'down' ? sendToSlack({ page, comment: trimmedComment }) : Promise.resolve(),
  ]);

  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const channel = i === 0 ? 'posthog' : 'slack';
      console.error(`[feedback] ${channel} dispatch failed:`, r.reason);
    }
  });

  return NextResponse.json({ ok: true });
}

async function sendToSlack({ page, comment }: { page: string; comment?: string }) {
  const url = process.env.SLACK_FEEDBACK_WEBHOOK_URL;
  if (!url) return; // silently no-op in local dev where webhook isn't configured

  const fullUrl = `${SITE_ORIGIN}${page}`;
  const message = {
    text: `:thumbsdown: Docs feedback on ${page}`, // fallback for clients that can't render blocks
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:thumbsdown: *Docs feedback*\n*Page:* <${fullUrl}|${page}>`,
        },
      },
      comment
        ? {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Comment:*\n>${comment.replace(/\n/g, '\n>')}`,
            },
          }
        : {
            type: 'context',
            elements: [{ type: 'mrkdwn', text: '_No comment left._' }],
          },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook returned ${res.status}: ${await res.text()}`);
  }
}

async function sendToPostHog({ rating, page, comment }: FeedbackPayload) {
  const key = process.env.POSTHOG_API_KEY;
  const host = getPostHogHost();
  if (!key) {
    console.warn('[feedback] POSTHOG_API_KEY is not configured; skipping PostHog dispatch');
    return;
  }

  // Use the page URL as the distinct_id so PostHog groups feedback by page
  // without ever associating it to a real user (docs site is anonymous).
  const event = {
    api_key: key,
    event: 'docs_feedback',
    distinct_id: `docs-anon-${page}`,
    properties: {
      rating,
      page,
      comment: comment ?? null,
      $current_url: `${SITE_ORIGIN}${page}`,
      $process_person_profile: false,
    },
    timestamp: new Date().toISOString(),
  };

  const res = await fetch(`${host}/i/v0/e/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    throw new Error(`PostHog returned ${res.status}: ${await res.text()}`);
  }
}

function getPostHogHost() {
  const configuredHost = process.env.POSTHOG_HOST?.replace(/\/+$/, '');

  if (!configuredHost) return DEFAULT_POSTHOG_HOST;

  // PostHog capture API calls must use the ingestion host, not the app host.
  if (configuredHost === 'https://eu.posthog.com') return DEFAULT_POSTHOG_HOST;

  return configuredHost;
}
