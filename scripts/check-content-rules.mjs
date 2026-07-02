#!/usr/bin/env node
/**
 * DataHawk docs — maintenance rule checker
 *
 * Enforces the event-triggered rules from CLAUDE.md Section 24:
 *   - a changelog entry is added
 *   - a new doc page is added
 *   - an existing page is edited (incl. renamed/moved/deleted)
 *
 * By default it only inspects files changed vs. a base ref (git diff), so it is
 * safe to run in CI on every PR without failing on pre-existing legacy content.
 * Pass --all to lint the entire content/ tree instead (useful for periodic audits).
 *
 * Usage:
 *   node scripts/check-content-rules.mjs            # diff mode, base = origin/main
 *   BASE_REF=origin/main node scripts/check-content-rules.mjs
 *   node scripts/check-content-rules.mjs --all       # full repo audit
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ALL_MODE = process.argv.includes('--all');
const BASE_REF = process.env.BASE_REF || 'origin/main';

const ALLOWED_TAGS = ['new', 'improvement', 'fix', 'breaking', 'maintenance', 'dashboard', 'company'];
const BRITISH_WORDS = [
  ['analyse', 'analyze'], ['analysing', 'analyzing'], ['analysed', 'analyzed'],
  ['organise', 'organize'], ['organising', 'organizing'], ['organised', 'organized'],
  ['optimise', 'optimize'], ['optimising', 'optimizing'], ['optimised', 'optimized'],
  ['colour', 'color'], ['behaviour', 'behavior'], ['favour', 'favor'],
  ['centre', 'center'], ['catalogue', 'catalog'], ['fulfilment', 'fulfillment'],
  ['programme', 'program'], ['whilst', 'while'], ['amongst', 'among'],
];
const BANNED_IMPORT_RE = /from\s+['"](fumadocs-ui\/components\/[^'"]+|@\/components\/Term|next\/image)['"]/;
const CURLY_QUOTE_RE = /[‘’“”]/;
// Deliberately excludes the arrow block (U+2190-U+21FF) — inline "Click X → Y"
// wayfinding arrows in prose are fine; only arrow-as-bullet-marker is banned,
// which isn't practical to detect reliably here (see CLAUDE.md Section 16).
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

const results = []; // { file, level: 'error'|'warn', message }

function report(file, level, message) {
  results.push({ file, level, message });
}

function sh(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 1. Figure out which files to check
// ---------------------------------------------------------------------------

function getChangedFiles() {
  if (ALL_MODE) return null; // signal: audit everything

  sh(`git fetch origin main --depth=50`); // best effort, ignore failure (offline / no remote)

  let diff = sh(`git diff --name-status ${BASE_REF}...HEAD -- content next.config.mjs lib/notion-redirects.mjs`);
  if (diff === null || diff.trim() === '') {
    diff = sh(`git diff --name-status HEAD~1...HEAD -- content next.config.mjs lib/notion-redirects.mjs`);
  }
  if (diff === null) return null; // couldn't compute a diff at all — fall back to full audit

  const entries = [];
  for (const line of diff.trim().split('\n').filter(Boolean)) {
    const parts = line.split('\t');
    const status = parts[0];
    if (status.startsWith('R')) {
      entries.push({ status: 'R', from: parts[1], to: parts[2] });
    } else if (status === 'A') {
      entries.push({ status: 'A', to: parts[1] });
    } else if (status === 'M') {
      entries.push({ status: 'M', to: parts[1] });
    } else if (status === 'D') {
      entries.push({ status: 'D', from: parts[1] });
    }
  }
  return entries;
}

function walkAllContent() {
  const out = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) walk(p);
      else if (name.endsWith('.mdx')) out.push({ status: 'A', to: path.relative(ROOT, p) });
    }
  })(path.join(ROOT, 'content'));
  return out;
}

// ---------------------------------------------------------------------------
// 2. Redirect table (next.config.mjs + lib/notion-redirects.mjs)
// ---------------------------------------------------------------------------

function loadRedirectSources() {
  const sources = new Set();
  for (const rel of ['next.config.mjs', 'lib/notion-redirects.mjs']) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf8');
    for (const m of text.matchAll(/(?:source|from):\s*['"]([^'"]+)['"]/g)) {
      sources.add(m[1]);
    }
  }
  return sources;
}

function toUrl(contentRelPath) {
  let p = contentRelPath.replace(/^content\//, '').replace(/\.mdx$/, '');
  p = p.replace(/(^|\/)index$/, '');
  return '/' + p;
}

function hasRedirectFor(sources, url) {
  if (sources.has(url)) return true;
  // allow a wildcard ancestor redirect like /help-center/knowledge-hub/:path*
  for (const s of sources) {
    if (s.endsWith('/:path*')) {
      const prefix = s.slice(0, -'/:path*'.length);
      if (url === prefix || url.startsWith(prefix + '/')) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// 3. Frontmatter — minimal parser (this repo's frontmatter is flat key: value)
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { frontmatter: null, raw: '', body: content };
  const raw = m[1];
  const body = m[2];
  const fm = {};
  for (const line of raw.split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    if (/^\[.*\]$/.test(value)) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, '');
    }
    fm[key] = value;
  }
  return { frontmatter: fm, raw, body };
}

// ---------------------------------------------------------------------------
// 4. General checks (Section 19 quality bar) — applies to any added/edited page
// ---------------------------------------------------------------------------

function lintGeneral(file, content) {
  const { frontmatter: fm, body } = parseFrontmatter(content);

  if (!fm) {
    report(file, 'error', 'Missing frontmatter block (--- title/description ---).');
    return { fm: {}, body: content };
  }
  if (!fm.title) report(file, 'error', 'Frontmatter is missing required `title`.');
  if (!fm.description) {
    report(file, 'error', 'Frontmatter is missing required `description`.');
  } else if (fm.description.length > 160) {
    report(file, 'error', `Description is ${fm.description.length} chars — must be ≤160.`);
  }

  const firstNonEmpty = body.split('\n').find((l) => l.trim() !== '');
  if (firstNonEmpty && /^#(?!#)/.test(firstNonEmpty.trim())) {
    report(file, 'error', 'Body starts with an H1 (`# ...`). Title comes from frontmatter — start with a prose paragraph.');
  }
  if (fm.description && firstNonEmpty) {
    const firstPara = body.split(/\n\s*\n/).map((s) => s.trim()).find(Boolean) || '';
    if (firstPara.replace(/\s+/g, ' ').toLowerCase() === fm.description.replace(/\s+/g, ' ').toLowerCase()) {
      report(file, 'warn', 'Intro paragraph repeats the frontmatter description verbatim — add context instead.');
    }
  }

  if (BANNED_IMPORT_RE.test(content)) {
    report(file, 'error', 'Imports a globally-registered component (Callout/Card/Steps/Accordion/Tabs/Files/TypeTable/InlineTOC/Term/Image). Remove the import — the tag works without it.');
  }
  if (/<PageFeedback/.test(content)) {
    report(file, 'error', '<PageFeedback /> is injected globally by the catchall page — remove it from this MDX file.');
  }
  if (/<Cards[\s>]/.test(content)) {
    report(file, 'error', 'Uses <Cards> wrapper — use <div className="card-grid"> instead (see Section 6).');
  }
  if (/docs\.datahawk\.co/.test(content)) {
    report(file, 'error', 'Contains a docs.datahawk.co URL — convert to a local Fumadocs path (see Section 13).');
  }
  if (CURLY_QUOTE_RE.test(content)) {
    report(file, 'error', 'Contains curly quotes (‘’“”) — use straight quotes.');
  }
  const stripped = content.replace(/⚙️/g, '');
  if (EMOJI_RE.test(stripped)) {
    report(file, 'error', 'Contains emoji in reader-facing content — not allowed outside Callout icons and the established ⚙️ "For analysts" heading (Section 16).');
  }
  const hrCount = body.split('\n').filter((l) => l.trim() === '---').length;
  if (hrCount > 1) {
    report(file, 'warn', `Body has ${hrCount} horizontal rules — use at most one, before a footer/dev section (Section 11b).`);
  }
  for (const [gb, us] of BRITISH_WORDS) {
    const re = new RegExp(`\\b${gb}\\b`, 'i');
    if (re.test(body)) report(file, 'error', `British spelling "${gb}" found — use American English "${us}".`);
  }

  return { fm, body };
}

// ---------------------------------------------------------------------------
// 5. Changelog-specific checks
// ---------------------------------------------------------------------------

function lintChangelog(file, fm) {
  const base = path.basename(file, '.mdx');
  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(base)) {
    report(file, 'error', 'Changelog filename must be YYYY-MM-DD-kebab-slug.mdx.');
  }
  if (!fm.date) {
    report(file, 'error', 'Changelog entry is missing required `date` frontmatter field.');
  } else {
    const filenameDate = base.slice(0, 10);
    if (fm.date !== filenameDate) {
      report(file, 'error', `Frontmatter date "${fm.date}" does not match filename date "${filenameDate}".`);
    }
  }
  if (!fm.tags) {
    report(file, 'error', 'Changelog entry is missing required `tags` frontmatter field.');
  } else {
    const tags = Array.isArray(fm.tags) ? fm.tags : [fm.tags];
    for (const t of tags) {
      if (!ALLOWED_TAGS.includes(t)) {
        report(file, 'error', `Tag "${t}" is not in the allowed taxonomy: ${ALLOWED_TAGS.join(', ')}.`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 6. New-doc structural checks (meta.json membership, filename convention)
// ---------------------------------------------------------------------------

function lintNewDoc(file, fm) {
  const base = path.basename(file, '.mdx');
  const dir = path.dirname(path.join(ROOT, file));
  const isChangelog = file.startsWith('content/changelog/');

  if (!isChangelog && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(base)) {
    report(file, 'error', 'Filename must be lowercase kebab-case with no punctuation (Section 14).');
  }

  const metaPath = path.join(dir, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    report(file, 'warn', 'No meta.json in this folder — verify the page is reachable/intentional (no sidebar entry will be generated).');
    return;
  }
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    report(file, 'error', `${path.relative(ROOT, metaPath)} is not valid JSON.`);
    return;
  }
  const pages = Array.isArray(meta.pages) ? meta.pages : [];
  const skipsList = pages.length === 1 && pages[0] === '';

  if (base === 'index') {
    if (pages[0] !== 'index') {
      report(file, 'warn', `meta.json "pages" should list "index" first (Section 17.1) — got [${pages.slice(0, 3).map((p) => `"${p}"`).join(', ')}...].`);
    }
    if (fm.title !== 'Introduction') {
      report(file, 'warn', 'index.mdx frontmatter title should be "Introduction" per Section 17.3 (folder toggle already carries the section name).');
    }
  } else if (!skipsList && !pages.includes(base)) {
    report(file, 'error', `"${base}" is not listed in ${path.relative(ROOT, metaPath)} "pages" — add it so the page shows in the sidebar.`);
  }
}

// ---------------------------------------------------------------------------
// 7. Renamed / deleted — redirect requirement
// ---------------------------------------------------------------------------

function lintRedirect(entry, redirectSources) {
  const oldFile = entry.from;
  if (!oldFile.startsWith('content/') || !oldFile.endsWith('.mdx')) return;
  if (path.basename(oldFile) === 'meta.json') return;
  const oldUrl = toUrl(oldFile);
  if (!hasRedirectFor(redirectSources, oldUrl)) {
    const verb = entry.status === 'R' ? 'renamed/moved' : 'deleted';
    report(oldFile, 'error', `Page was ${verb} but no redirect from "${oldUrl}" exists in next.config.mjs / lib/notion-redirects.mjs (Section 13 — never delete/skip a redirect).`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const changed = getChangedFiles();
  const entries = changed === null ? walkAllContent() : changed;
  const redirectSources = loadRedirectSources();

  if (changed === null) {
    console.log(ALL_MODE ? 'Running full-repo audit (--all).' : 'Could not compute a git diff — falling back to full-repo audit.');
  } else {
    console.log(`Checking ${entries.length} changed file(s) vs ${BASE_REF}.`);
  }

  for (const entry of entries) {
    if (entry.status === 'R') {
      lintRedirect(entry, redirectSources);
    }
    if (entry.status === 'D') {
      lintRedirect(entry, redirectSources);
      continue;
    }

    const file = entry.to;
    if (!file || !file.endsWith('.mdx') || !file.startsWith('content/')) continue;

    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) continue;
    const content = fs.readFileSync(abs, 'utf8');

    const { fm } = lintGeneral(file, content);
    if (file.startsWith('content/changelog/')) {
      lintChangelog(file, fm);
    } else if (entry.status === 'A') {
      lintNewDoc(file, fm);
    }
  }

  const errors = results.filter((r) => r.level === 'error');
  const warnings = results.filter((r) => r.level === 'warn');

  if (results.length === 0) {
    console.log('No issues found.');
  } else {
    for (const r of [...errors, ...warnings]) {
      console.log(`${r.level === 'error' ? 'ERROR' : 'WARN '}  ${r.file}\n        ${r.message}`);
    }
    console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
  }

  if (errors.length > 0) process.exit(1);
}

main();
