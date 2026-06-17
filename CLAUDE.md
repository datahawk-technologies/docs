# DataHawk Docs — Authoring Rulebook for Claude Code

You are an agent working inside the DataHawk Fumadocs documentation repository. This file describes the conventions you MUST follow when authoring or editing MDX content and components. Read it carefully — these rules were established through iteration and exist for specific reasons.

---

## 1. Repository overview

This is a **Fumadocs UI 16.x** docs site running on **Next.js 16.x** with **pnpm**. Pages live in `content/` as MDX. The site has four user-visible top-level tabs and one hidden one:

- `content/welcome/` → **Welcome** tab — onboarding for new customers
- `content/help-center/` → **Help Center** tab — main reference content (98+ pages)
- `content/troubleshooting/` → **Troubleshooting** tab — problem/solution guides
- `content/changelog/` → **Changelog** tab — release notes, one MDX per release
- `content/api-reference/` → **API Reference** tab — currently hidden in `lib/tabs.ts`

Each tab has its own catchall route at `app/<tab>/[[...slug]]/page.tsx` that renders MDX via the registered global components.

The full content tree is mirrored in `app/` for routing and in `lib/source.ts` for Fumadocs source loaders. **Don't change folder names** without also updating those two locations.

---

## 2. The cardinal rule — NEVER import these in MDX

The following components are registered globally in `mdx-components.tsx` at the repo root. They are available in EVERY MDX file automatically. **Importing them at the top of an MDX file will SHADOW the global registration** and break the custom Callout emoji icons, Term tooltips, and any other future overrides.

**Do not add any of these imports to MDX files:**

```mdx
import { Callout } from 'fumadocs-ui/components/callout';   ❌ NEVER
import { Card, Cards } from 'fumadocs-ui/components/card'; ❌ NEVER
import { Step, Steps } from 'fumadocs-ui/components/steps'; ❌ NEVER
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'; ❌ NEVER
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'; ❌ NEVER
import { File, Files, Folder } from 'fumadocs-ui/components/files'; ❌ NEVER
import { TypeTable } from 'fumadocs-ui/components/type-table'; ❌ NEVER
import { InlineTOC } from 'fumadocs-ui/components/inline-toc'; ❌ NEVER
import Image from 'next/image'; ❌ NEVER
import { Term } from '@/components/Term'; ❌ NEVER
import { PageFeedback } from '@/components/PageFeedback'; ❌ NEVER
```

The component tags (`<Callout>`, `<Cards>`, `<Term>`, `<Image>`, etc.) DO work — just don't import them.

**Also don't add `<PageFeedback />` to any MDX file by hand.** It's injected globally by every catchall `page.tsx` (help-center, troubleshooting, welcome, changelog, api-reference) with an auto-computed `lastUpdated` date sourced from the file's last git commit. Adding it to an MDX file produces a duplicate widget.

**To verify a converted MDX file is clean:**

```bash
grep "from 'fumadocs-ui/components/\|from '@/components/Term\|from 'next/image'" content/path/to/file.mdx
```

Expected output: nothing.

---

## 3. Frontmatter format

Every MDX file MUST start with frontmatter:

```mdx
---
title: Page Title Here
description: One-sentence description that appears as the subtitle under the H1 and in search results.
---
```

### Universal rules

- `title` is required — renders as the H1, so the MDX body must NOT start with `#`
- `description` is required — keep it **≤160 characters** (search snippets truncate beyond that)
- Description must NOT be repeated in the first body paragraph (see Section 7 on intro paragraphs)

### Section-specific frontmatter

**Changelog entries** have additional required fields:

```mdx
---
title: "Release title — short headline"
description: "One-sentence factual summary of what changed. Quoted to be safe with YAML."
date: "2026-06-15"
tags: ["improvement", "breaking"]
---
```

- **Quote any string that contains a colon, dash, or other YAML-special character** — the changelog descriptions consistently use double quotes. This avoids the `bad indentation of a mapping entry` build error.
- `date` is required as `"YYYY-MM-DD"` — must match the filename's date prefix
- `tags` array uses ONLY these 7 values (the established taxonomy):

| Tag | Use when… |
|---|---|
| `new` | New dataset, table, dashboard, or feature |
| `improvement` | Existing feature got measurably better |
| `fix` | Bug squashed |
| `breaking` | Deprecation, schema change, methodology shift — customer may need to update queries/dashboards |
| `maintenance` | Infra change, schema additions, internal cleanup |
| `dashboard` | Power BI or Looker Studio template update |
| `company` | Company news (acquisition, leadership) |

Combine tags freely (e.g. `["new", "breaking"]` for a new dataset that deprecates an old one).

### Optional frontmatter

```mdx
---
title: Page Title
description: Description text.
full: true   # use for landing pages that should not show the right-side TOC
---
```

---

## 4. Callout — use emoji icons, never import

Five Callout types are pre-styled with emoji icons via `mdx-components.tsx`:

```mdx
<Callout type="info">
  General information or a tip. Renders with 💡 icon.
</Callout>

<Callout type="warn">
  Warning. Renders with ⚠️ icon.
</Callout>

<Callout type="error">
  Hard error or blocker. Renders with ❌ icon.
</Callout>

<Callout type="success">
  Confirmation or success state. Renders with ✅ icon.
</Callout>
```

Notion-style mapping:

| Notion icon | MDX `type` |
|---|---|
| 💡 lightbulb / blue info | `info` |
| ⚠️ warning / yellow | `warn` |
| 🚨 / 🛑 / ❌ red | `error` |
| ✅ green check | `success` |
| Anything else | `info` (default) |

---

## 5. Term — inline glossary tooltips

Wrap technical terms with `<Term>` to give readers a hover tooltip with a short definition + a link to the full glossary entry. Terms are defined once in `lib/glossary.ts` and used everywhere.

```mdx
The <Term>ASIN</Term> for this product appears on the page.
The <Term>**ASIN**</Term> in your CSV must be a valid 10-character ID.   ← bold inside Term also works
```

### Wrapping rules — read carefully

1. **Wrap the FIRST occurrence on each page**, not every one. Once a reader has seen the tooltip, they don't need it again on the same page.
2. **Don't wrap a term on a page that's specifically about that term.** If the page title, URL slug, or H2/H3 heading defines the term, the tooltip would be circular. Example: don't wrap `<Term>Sherlock</Term>` on `/help-center/modules/sherlock/`. Don't wrap glossary terms inside the glossary page itself.
3. **Don't wrap a term inside a markdown heading** (`## Foo`, `### Bar`). Headings auto-link in Fumadocs and the Term wrapper conflicts.
4. **Lookup is case-insensitive** — `<Term>ASIN</Term>`, `<Term>Asin</Term>`, `<Term>asin</Term>` all resolve to the same glossary entry.
5. **If a term isn't in `lib/glossary.ts`, the component renders the children as plain text** with no decoration. Safe to wrap experimental terms — they'll degrade gracefully until added to the glossary.

### Adding a new term

Edit `lib/glossary.ts`. Append:

```ts
NEW_TERM: {
  title: 'Full descriptive name',
  short: 'One or two sentence definition.',
},
```

Available immediately across all MDX files. No restart needed for content changes.

### Terms currently in the glossary

ASIN, SKU, FNSKU, Marketplace, FBA, FBM, MFN, SnS, ACoS, TACoS, ROAS, DSP, DPV, NTB, SoV, SP, SB, SD, COGS, VAT, Buy Box, BSR, SQP, MCP, Workspace, WSID, Sherlock, Capacity, Snowflake, BigQuery, OAuth, SP-API, 1P, 3P.

---

## 6. Cards — always wrap in `<div className="card-grid">`

The repo's CSS (`app/global.css`) defines a custom `.card-grid` class that gives Cards proper grid alignment. **Do NOT use Fumadocs's built-in `<Cards>` wrapper** — it doesn't align card heights correctly.

```mdx
<div className="card-grid">
  <Card
    title="Card Title"
    href="/destination/path"
    description="One sentence summary."
  />
  <Card
    title="Another Card"
    href="/another/path"
    description="Another summary."
  />
  <Card
    title="Third Card"
    href="/third/path"
    description="Third summary."
  />
</div>
```

The CSS auto-adjusts:

- 3 cards → 3-column grid
- Even count (2, 4, 8, 10) → 2-column grid
- 6 or 9 cards → 3-column grid (multiples of 3)
- Mobile → 1-column

When to use cards vs other patterns:

- **Cards** — index/hub pages where each item is a link to a sub-page with a short description
- **Steps** — sequential procedures the reader follows in order
- **Accordions** — FAQ-style content where the reader scans for their specific question

---

## 7. Headings hierarchy and intro paragraphs

- **H1 comes from the frontmatter `title`** — DO NOT write `# Heading` at the top of the body
- **Every page must start its body with a paragraph**, not an H2 — this is the "intro paragraph" convention
- The intro paragraph **must add context the frontmatter description doesn't already cover** — repeating the description verbatim makes the page look amateur. A good intro:
  - Defines key concepts the page assumes
  - Sets up the first H2 ("here's what you'll find below")
  - Anchors the topic in the larger DataHawk model (e.g., "Equivalent to Amazon Seller Central for the Walmart ecosystem")
- Start body H2s with `##`, sub-sections with `###`, H4 (`####`) sparingly
- Avoid H5/H6 — restructure the content instead

**Anti-pattern (don't do this):**

```mdx
---
title: Walmart Marketplace Account
description: Connect your Walmart Marketplace account to DataHawk to collect US seller data.
---

## Your Walmart Marketplace Account                    ← redundant with title

Walmart Marketplace is a platform for selling on Walmart.com.   ← belongs in an intro paragraph
DataHawk lets you connect unlimited accounts.
```

**Correct pattern:**

```mdx
---
title: Walmart Marketplace Account
description: Connect your Walmart Marketplace account to DataHawk to collect US seller data.
---

Walmart Marketplace is Walmart's third-party seller platform — the equivalent of Amazon Seller Central for the Walmart ecosystem. Connect your account to DataHawk to automatically pull sales, fulfillment, and item-level data. There's no limit on the number of US-registered Marketplace accounts you can link.

## DataHawk Connection Capabilities                    ← first real H2
```

The intro adds the "equivalent of Amazon Seller Central" anchor and the unlimited-accounts detail — neither was in the description, neither is in the H2 below. That's how you add value.

---

## 8. Steps — for numbered procedures

```mdx
<Steps>

<Step>

### Step heading

Step body. Can include images, code, callouts, etc.

</Step>

<Step>

### Next step

Another step.

</Step>

</Steps>
```

**Do not put links in Step headings.** Fumadocs auto-wraps headings in anchor tags, and nesting an `<a>` inside an `<a>` causes a hydration error. If a step needs a "Read more" link, put it BELOW the heading:

```mdx
<Step>

### Configure your Amazon account

Brief description of what this step covers.

[Read the full guide →](/help-center/data-setup/seller-account)

</Step>
```

---

## 9. Accordion — for FAQs and collapsibles

```mdx
<Accordions>
  <Accordion title="Question text or short label">
    Answer or hidden content. Can be multiple paragraphs and contain other MDX components.
  </Accordion>
  <Accordion title="Another question">
    Another answer.
  </Accordion>
</Accordions>
```

Use when Notion has toggle blocks, when content is FAQ-style, or when a long page would benefit from collapsible sections.

---

## 10. Tabs — for content that varies by context

```mdx
<Tabs items={['Amazon Seller', 'Amazon Vendor', 'Walmart']}>
  <Tab value="Amazon Seller">
    Content for sellers.
  </Tab>
  <Tab value="Amazon Vendor">
    Content for vendors.
  </Tab>
  <Tab value="Walmart">
    Content for Walmart.
  </Tab>
</Tabs>
```

Use when parallel sections differ only by platform/role/version.

---

## 11. Images

Static images live in `public/` and are referenced via root-relative URLs.

| File on disk | URL in MDX |
|---|---|
| `public/foo.png` | `/foo.png` |
| `public/images/help-center/dashboard.png` | `/images/help-center/dashboard.png` |

### Three rules to internalize

1. **Always start with `/`** — absolute path from site root
2. **Never include `public/`** — Next.js maps that folder to root automatically
3. **Case-sensitive in production** — `Dashboard.png` ≠ `dashboard.png`

### Embedding methods

| Method | Syntax | Best for | Optimization |
|---|---|---|---|
| Markdown | `![alt](/images/foo.png)` | Inline images, animated GIFs (preserves animation) | None |
| HTML | `<img src="..." width="700" />` | When you need size or className control | None |
| `<Image>` (registered globally) | `<Image src="/..." width={1200} height={680} alt="..." />` | Hero images, screenshots above 500KB | Auto WebP, lazy load, responsive |

**Two `<Image>` gotchas:**

1. **`width` and `height` are required** (or use `fill` for parent-sized images). Without them Next.js errors at build.
2. **GIFs lose animation when wrapped in `<Image>`.** Use plain markdown `![]()` or `<img>` for animated GIFs.

### Folder convention

```
public/images/
├── welcome/
├── help-center/
│   ├── datahawk-app/
│   ├── data-setup/
│   └── modules/
├── changelog/
└── shared/
```

Mirror the content folder structure so images are easy to find.

---

## 11b. Horizontal rules (`---`)

Use `---` only once per page, and only to mark the transition from main content to a navigation or meta-footer section ("Where to go next," "Related articles," "Still stuck?" callouts, or a `## ⚙️ For analysts & developers` walled-off section). **Never between content H2 sections.** Most pages don't need one at all.

**Correct usage:**

```mdx
## Main content section

Content here…

## Another main content section

More content…

---

## ⚙️ For analysts & developers   ← HR before the dev-only section
…
```

or

```mdx
## Main content section

…

---

## Where to go next   ← HR before the navigation footer

<div className="card-grid">…</div>
```

**Wrong (don't do this):**

- HR between two content H2s — the H2 itself is already the separator.
- Multiple HRs on the same page — degrades the visual signal.
- HR right after the frontmatter — the subtitle already provides visual separation.
- HR used as decoration with no purpose.

---

## 12. Code blocks

Standard MDX fenced code blocks. Specify language for syntax highlighting:

````mdx
```typescript
const x = 1;
```
````

Fumadocs supports `title` and `lineNumbers` annotations:

````mdx
```typescript title="lib/source.ts" lineNumbers
import { source } from 'fumadocs-source';
```
````

---

## 13. Internal links

Convert all `docs.datahawk.co/Page-Name-{hash}` URLs to local Fumadocs paths. The URL is the file path under `content/` with the `.mdx` extension stripped and `index` collapsed to the folder root.

Examples:

| File on disk | URL |
|---|---|
| `content/help-center/datahawk-app/account-management.mdx` | `/help-center/datahawk-app/account-management` |
| `content/help-center/datahawk-app/index.mdx` | `/help-center/datahawk-app` |
| `content/troubleshooting/data-discrepancies/manufacturing-vs-sourcing-views.mdx` | `/troubleshooting/data-discrepancies/manufacturing-vs-sourcing-views` |

**Always strip the `content/` prefix and the `.mdx` extension.**

### URL redirects

Old URLs that have moved or been renamed are preserved via `next.config.mjs` `redirects()`. **Never delete a redirect** — they protect customer bookmarks, support team email links, and search engine indexes.

When you rename or move a file:
1. Add a redirect from the OLD URL to the NEW URL in `next.config.mjs` with `permanent: true`
2. Update any internal references to use the new URL
3. Restart the dev server (Next.js doesn't hot-reload `next.config.mjs`)

---

## 14. Filename conventions

- **Always lowercase**
- **Use hyphens** between words — never underscores, spaces, commas, or apostrophes
- **Don't use punctuation** — no commas, apostrophes, parentheses, or question marks in filenames
- **Keep slugs short** — under 50 characters where possible. URLs are customer-facing surfaces

Examples:

```
✓ manufacturing-vs-sourcing-views.mdx
✓ no-data-after-dsp-connect.mdx
✓ amz-vendor-account-sourcing-manufacturing.mdx

❌ i-cannot-see-data-in-manufacturing-views,-but-i-see-it-in-sourcing.mdx
❌ i-don't-see-data-after-connecting-my-dsp-account.mdx
❌ How_To_Connect_DSP.MDX
```

When renaming an existing file, add a redirect in `next.config.mjs` for the old URL.

---

## 15. Notion-specific patterns to translate

Some older content was migrated from Notion. When you encounter Notion-style patterns:

| Notion pattern | Fumadocs MDX equivalent |
|---|---|
| Callout block (any color) | `<Callout type="...">` — match the color/intent |
| Toggle block | `<Accordion title="...">` inside `<Accordions>` |
| Sub-page link tiles / "child page" blocks | `<Card>` inside `<div className="card-grid">` |
| Bookmark to external URL | Plain markdown link `[label](url)` |
| Synced block / Database view | NOT supported in MDX — replace with regular content or a Card grid |
| Equation block | Inline as code, or use a remark-math plugin (not currently installed) |
| Video embed (YouTube/Loom) | `<iframe src="..." />` — but ideally upload to a hosted spot first |
| Image | Download to `/public/images/...` and link locally (see section 11) |
| File attachment | Upload to `/public/files/...` and link |
| `docs.datahawk.co/Page-Name-{hash}` URL | Convert to local Fumadocs path (see section 13) |

---

## 16. Language and style conventions

### American English

**Use American English throughout.** Common conversions:

| British | American |
|---|---|
| -ise/-isation | -ize/-ization (analyze, organize, optimize) |
| -our | -or (color, behavior, favor) |
| -re | -er (center, meter) |
| catalogue | catalog |
| fulfilment | fulfillment |
| programme | program |
| whilst | while |
| amongst | among |

### Brand naming

Match the brand owner's official capitalization:

- **DataHawk** — capital D, capital H. Not "Datahawk", not "DATAHAWK"
- **Power BI** — space between Power and BI (Microsoft's convention)
- **Looker Studio** — not "Data Studio" (old name, deprecated)
- **BigQuery** — single word, capital B and Q
- **Snowflake** — single word, capital S

### Quotes

Use **straight quotes** (`'` and `"`), never curly (`'` `"` `‘` `’`). MDX text editors may auto-insert curly quotes — they get stripped during builds and look inconsistent.

---

## 17. Sidebar configuration via meta.json

Each folder containing MDX files can have a `meta.json` controlling sidebar appearance:

### Top-level (e.g. `content/help-center/meta.json`)

```json
{
  "title": "Help Center",
  "description": "Self-serve answers and how-tos",
  "root": true,
  "pages": ["index", "datahawk-app", "data-setup", "modules", ...]
}
```

- `root: true` marks this as the top of a tab's sidebar
- `pages` array controls sidebar order — list MDX filenames without `.mdx`, and folder names for nested sections

### Subfolder (e.g. `content/troubleshooting/data-discrepancies/meta.json`)

```json
{
  "title": "Data discrepancies",
  "pages": [""]
}
```

The `pages: [""]` pattern is intentional in troubleshooting — it hides the individual articles from the sidebar so only the category index shows. Users navigate to articles via cross-links inside the category index, not via the sidebar tree.

---

## 18. Subtitle / page description styling

The frontmatter `description` renders as the subtitle under the H1. Custom CSS in `app/global.css` sets it to body-text size with a muted navy-gray color (not larger or italic, as Fumadocs defaults). The current rule:

```css
article > p.text-lg.text-fd-muted-foreground {
  color: #5a7090;
  font-weight: 400;
  font-size: 1rem;
  font-style: normal;
  margin-bottom: 1.75rem;
}
```

**Implication for authors:** the description shows up at the same size as body text. Don't write descriptions that look weird at body size — keep them concise, declarative, and ≤160 characters.

---

## 19. Quality bar before marking a page LIVE

A converted or new page passes if:

- ✅ Frontmatter has `title` and `description` (and `date` + `tags` for changelog entries)
- ✅ Description is ≤160 characters and does NOT contain a colon-space pattern (or is double-quoted)
- ✅ Body starts with a paragraph (not H2) that adds context beyond the description
- ✅ No `import { ... } from 'fumadocs-ui/components/...'` or `from '@/components/Term'` lines
- ✅ All `docs.datahawk.co/...` URLs replaced with local Fumadocs paths
- ✅ Callouts use the right `type` for their intent
- ✅ Numbered procedures wrap in `<Steps>`
- ✅ Sub-page link clusters wrap in `<div className="card-grid">` (not `<Cards>`)
- ✅ At least one technical term is wrapped in `<Term>` if any appear on the page (unless the page is ABOUT that term)
- ✅ Filenames are lowercase kebab-case with no punctuation
- ✅ Internal links resolve (test by navigating in the dev server)
- ✅ Description and intro paragraph don't repeat the same information
- ✅ American English throughout (no British spellings)

If any of these fails, leave Status as `IN PROCESS` and write a note rather than marking LIVE.

---

## 20. Building and running

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Clean restart (do this after renames, config changes, or "Cannot find module" errors)
rm -rf .next .source && pnpm dev
```

**Cache-busting cheat sheet:**

| Symptom | Fix |
|---|---|
| `Cannot find module './vendor-chunks/...'` | `rm -rf .next && pnpm dev` |
| Frontmatter schema errors after editing source.config.ts | `rm -rf .next .source && pnpm dev` |
| Redirects added but URL still 404s | Restart dev server (Next.js doesn't hot-reload `next.config.mjs`) |
| MDX changes don't appear | Hard refresh browser (⌘ + Shift + R) |
| `pnpm dev` says port 3000 in use | `lsof -ti:3000 \| xargs kill -9` then retry |

---

## 21. Component reference

Custom components in `components/`:

| Component | Purpose | Where used |
|---|---|---|
| `Term.tsx` | Inline glossary tooltip — wraps a term in a dotted-underline span with hover tooltip | Anywhere in MDX |
| `PageFeedback.tsx` | "Last updated: …" + 👍 / 👎 widget at the bottom of every page | Injected by catchall `page.tsx` — never add to MDX |
| `ChangelogList.tsx` | Filterable card list of changelog entries | Changelog landing page |
| `ChangelogPager.tsx` | Older/Newer release navigation at the bottom of individual entries | Individual changelog pages |
| `ChangelogSidebar.tsx` | Sidebar showing latest 5 releases + Subscribe options | Changelog tab sidebar (via `sidebar.banner` prop) |
| `EmailSubscribeButton.tsx` | Sidebar button that opens/scrolls to the subscribe form | Inside ChangelogSidebar |
| `SubscribeForm.tsx` | Collapsible HubSpot embed for email signup | Changelog landing top |

**You generally don't author these — they're stable plumbing.** If you need to change customer-facing copy in any of them, edit the component file; if you need to change behavior, ask first.

---

## 22. Feedback widget — how it works

Every page (help-center, troubleshooting, welcome, changelog entry, api-reference) renders `<PageFeedback>` automatically. Authors never add it to MDX. It does two things:

- Shows **"Last updated: Mon DD, YYYY"** — pulled from the file's last git commit at build time via `lib/git-last-modified.ts`. No frontmatter field to maintain. (Exception: changelog entries use the frontmatter `date` instead, so a typo fix doesn't make an old release look fresh.)
- Renders **👍 / 👎** buttons. On click, the component POSTs to `/api/feedback` (fire-and-forget, `keepalive: true`). That route fans out:
  - **Slack `#docs-gaps`** — only on 👎. The optional comment ("What was missing?") is included. Configured via `SLACK_FEEDBACK_WEBHOOK_URL`.
  - **PostHog** — every vote, as event `docs_feedback` with `{ rating, page, comment }`. Use this for "worst pages over time" dashboards and to tune Slack alerts in PostHog itself if `#docs-gaps` ever gets noisy.

A visitor's vote is also cached in `localStorage` keyed by pathname so the same browser doesn't re-vote on the same page.

**Required env vars** (see `.env.local.example`): `SLACK_FEEDBACK_WEBHOOK_URL`, `POSTHOG_API_KEY`, optionally `POSTHOG_HOST`. With nothing set, the API route still returns 200 — the dispatch is just a no-op. That keeps local dev quiet without breaking the widget.

**Slack webhook setup:** the `#docs-gaps` channel is baked into the webhook URL at creation time. To re-target the channel later, regenerate a webhook from `https://api.slack.com/apps` against the new channel and swap the env var.

---

## 23. When in doubt

- **Faithful conversion** when porting from Notion — don't rewrite content, just structurally translate Notion blocks → Fumadocs components
- **Ask before deleting** — if a block doesn't translate cleanly, leave it as an MDX comment `{/* original block content */}` rather than dropping silently
- **Verify with `pnpm dev`** — if a build breaks, read the terminal output to find the exact file and line
- **Test internal links by clicking** — the redirect chain catches many broken links but not all

---

End of rulebook. These conventions apply to every MDX file and every component edit in the repo.
