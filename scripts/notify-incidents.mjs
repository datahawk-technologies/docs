#!/usr/bin/env node
/**
 * Posts DataHawk incident updates to Slack (customer Slack Connect channels).
 *
 * What it posts, and when:
 *   - A new file in content/incidents/   -> "New incident" message
 *   - A changed `status` in an existing  -> "Status update" message
 *   - Any other edit (wording, typos)     -> nothing
 *
 * Where it posts: every channel the "DataHawk Incidents" Slack bot is a member
 * of. Adding a customer = `/invite @DataHawk Incidents` in their channel. No
 * channel list lives in this (public) repo, on purpose: it would name customers.
 *
 * Runs in GitHub Actions (.github/workflows/incident-notify.yml) on every push
 * to main that touches content/incidents/. It can also run by hand for testing.
 *
 * Usage:
 *   node scripts/notify-incidents.mjs --file <path> --dry-run
 *       Print the message for one incident. Sends nothing. No token needed.
 *   node --env-file=.env.local scripts/notify-incidents.mjs --file <path> --channel <ID>
 *       Post one incident to ONE channel only (use a private test channel).
 *   node scripts/notify-incidents.mjs --before <sha> --after <sha>
 *       What CI runs: compare two commits and post what changed.
 *
 * Other flags:
 *   --no-wait   Don't wait for the incident page to be live before posting.
 *
 * Env:
 *   SLACK_BOT_TOKEN       Bot User OAuth Token (xoxb-...). GitHub secret in CI.
 *   NEXT_PUBLIC_SITE_URL  Optional. Defaults to https://docs.datahawk.co
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INCIDENTS_DIR = 'content/incidents';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://docs.datahawk.co';
const TOKEN = process.env.SLACK_BOT_TOKEN;

// Keep in sync with app/incidents/feed.xml/route.ts
const STATUS = {
  'in-progress': { emoji: '🏗️', label: 'In progress', color: '#f2a93b' },
  'resolved-no-data-impact': { emoji: '✅', label: 'Resolved (no data impact)', color: '#2eb67d' },
  'resolved-data-unrecoverable': { emoji: '⚠️', label: 'Resolved (data unrecoverable)', color: '#e01e5a' },
};

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const DRY_RUN = flag('--dry-run');
const NO_WAIT = flag('--no-wait');
const ONLY_CHANNEL = opt('--channel');
const FILE = opt('--file');
const BEFORE = opt('--before');
const AFTER = opt('--after') || 'HEAD';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

// Same parser as scripts/check-content-rules.mjs (incident frontmatter is flat).
function parseFrontmatter(content) {
  const m = content?.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (/^\[.*\]$/.test(value)) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, '');
    }
    fm[kv[1]] = value;
  }
  return fm;
}

// Slack mrkdwn treats &, < and > as control characters.
function esc(text = '') {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function incidentUrl(file) {
  return `${SITE_URL}/incidents/${path.basename(file, '.mdx')}`;
}

// ---------------------------------------------------------------------------
// What changed?
// ---------------------------------------------------------------------------

function changesFromGit(before, after) {
  if (!before || /^0+$/.test(before)) {
    console.log('No previous commit to compare with (first push). Nothing to post.');
    return [];
  }
  const diff = git(`diff --name-status --find-renames ${before} ${after} -- ${INCIDENTS_DIR}`);
  if (diff === null) throw new Error(`git diff ${before} ${after} failed. Is the history fetched?`);

  const changes = [];
  for (const line of diff.trim().split('\n').filter(Boolean)) {
    const parts = line.split('\t');
    const kind = parts[0][0];
    const oldPath = parts[1];
    const newPath = parts[parts.length - 1];
    if (!newPath.endsWith('.mdx') || kind === 'D') continue;

    const now = parseFrontmatter(git(`show ${after}:${newPath}`));
    if (!now) continue;

    if (kind === 'A') {
      changes.push({ file: newPath, fm: now, event: 'New incident' });
      continue;
    }
    const was = parseFrontmatter(git(`show ${before}:${oldPath}`));
    if (was && was.status !== now.status) {
      const from = STATUS[was.status]?.label ?? was.status;
      changes.push({ file: newPath, fm: now, event: 'Status update', from });
    }
  }
  return changes;
}

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

function buildMessage({ file, fm, event, from }) {
  const s = STATUS[fm.status] ?? { emoji: '', label: fm.status, color: '#868686' };
  const url = incidentUrl(file);
  const datasets = Array.isArray(fm.datasetsImpacted) ? fm.datasetsImpacted : [];

  // Shown above the coloured card, and as the notification preview.
  // The status appears once, here; the card below carries the title and details.
  const headline = event === 'Status update' && from
    ? `*Status update* · ${from} → ${s.emoji} ${s.label}`
    : `*New incident* · ${s.emoji} ${s.label}`;

  const blocks = [
    // rich_text, not section: Slack caps section blocks at about two thirds of
    // the message width (room for an accessory), so the description wrapped early.
    // rich_text uses the full width and reflows with the window.
    {
      type: 'rich_text',
      elements: [
        {
          type: 'rich_text_section',
          elements: [
            { type: 'link', url, text: fm.title, style: { bold: true } },
            { type: 'text', text: `\n${fm.description ?? ''}` },
          ],
        },
      ],
    },
  ];

  // Status updates stay short: the reader already saw the full details when the
  // incident was first posted, so only the description and the link follow.
  const isUpdate = event === 'Status update';
  if (!isUpdate) blocks.push(
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Severity*\n${esc(fm.severity ?? 'n/a')}` },
        { type: 'mrkdwn', text: `*Affected dates*\n${esc(fm.dateRangeImpacted || 'n/a')}` },
      ],
    },
  );
  if (!isUpdate && datasets.length > 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Datasets affected*\n${datasets.map((d) => `\`${d}\``).join('\n')}` },
    });
  }
  // No "View incident" button: the title is already the link, and a URL button
  // shows a warning icon on click unless the Slack app has Interactivity enabled.

  return {
    text: headline,
    attachments: [{ color: s.color, blocks }],
    unfurl_links: false,
  };
}

// ---------------------------------------------------------------------------
// Slack
// ---------------------------------------------------------------------------

async function slack(method, body) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Slack ${method} failed: ${json.error}`);
  return json;
}

async function botChannels() {
  const channels = [];
  let cursor;
  do {
    const r = await slack('users.conversations', {
      types: 'public_channel,private_channel',
      exclude_archived: true,
      limit: 200,
      cursor,
    });
    channels.push(...r.channels.map((c) => ({ id: c.id, name: c.name })));
    cursor = r.response_metadata?.next_cursor;
  } while (cursor);
  return channels;
}

// The repo push lands before the site finishes deploying. Wait so the
// incident link never 404s for a customer. Gives up after 15 minutes.
async function waitUntilLive(url) {
  const deadline = Date.now() + 15 * 60 * 1000;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (r.ok) return true;
    } catch {}
    console.log(`Waiting for ${url} to go live...`);
    await new Promise((r) => setTimeout(r, 30_000));
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let changes;
  if (FILE) {
    const fm = parseFrontmatter(fs.readFileSync(path.resolve(ROOT, FILE), 'utf8'));
    if (!fm) throw new Error(`No frontmatter found in ${FILE}`);
    changes = [{ file: FILE, fm, event: 'New incident' }];
  } else {
    changes = changesFromGit(BEFORE, AFTER);
  }

  if (changes.length === 0) {
    console.log('No new incidents or status changes. Nothing to post.');
    return;
  }

  if (DRY_RUN) {
    for (const c of changes) {
      console.log(`--- ${c.event}: ${c.file}`);
      console.log(JSON.stringify(buildMessage(c), null, 2));
    }
    console.log('\nDry run: nothing sent. Preview the blocks at https://app.slack.com/block-kit-builder');
    return;
  }

  if (!TOKEN) throw new Error('SLACK_BOT_TOKEN is not set.');

  const channels = ONLY_CHANNEL ? [{ id: ONLY_CHANNEL, name: ONLY_CHANNEL }] : await botChannels();
  if (channels.length === 0) {
    console.log('The bot is not in any channel yet. Invite it with /invite @DataHawk Incidents.');
    return;
  }

  let failures = 0;
  for (const c of changes) {
    const url = incidentUrl(c.file);
    if (!NO_WAIT && !(await waitUntilLive(url))) {
      console.error(`Page never went live: ${url}. Skipping, so customers don't get a broken link.`);
      failures++;
      continue;
    }
    const message = buildMessage(c);
    for (const ch of channels) {
      try {
        await slack('chat.postMessage', { channel: ch.id, ...message });
        console.log(`Posted "${c.fm.title}" (${c.event}) to #${ch.name}`);
      } catch (e) {
        // One customer's channel failing (e.g. their admin blocked the app)
        // must not stop everyone else from getting the update.
        console.error(`Could not post to #${ch.name}: ${e.message}`);
        failures++;
      }
    }
  }
  if (failures > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
