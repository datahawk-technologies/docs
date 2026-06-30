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

ASIN, SKU, FNSKU, Marketplace, FBA, FBM, MFN, SnS, ACoS, TACoS, RoAS, DSP, DPV, NTB, SoV, SP, SB, SD, COGS, VAT, Buy Box, BSR, SQP, MCP, Workspace, WSID, Sherlock, Capacity, Snowflake, BigQuery, OAuth, SP-API, 1P, 3P, bps, PoP, YoY, Ad Spend, Ad Sales, Ad Sales Same SKU, Ad Sales Other SKU, Impressions, Clicks, CTR, CPC, CVR, New-to-Brand Sales, Glance Views, Page Views, Sessions, ASP, Ordered Revenue, Return Rate.

> See section 5b below for the rule on how metric acronyms (ACoS, RoAS, CTR, etc.) are defined: the **acronym** lives here with a concept-level definition, but the **formula** lives on the dashboard page where the metric is used.

---

## 5b. Terms vs Metrics — where each lives

DataHawk docs separate **terms** (concepts) from **metrics** (formulas). The test for which a given entry is:

> **Does it have a formula?**
> - **No** → it's a **term**. Lives in `lib/glossary.ts` and `content/help-center/glossary.mdx`. Wrap in `<Term>X</Term>` in body prose.
> - **Yes** → it's a **metric**. The formula lives in a `## Metrics` table on the dashboard page where the metric is used. If the metric also has an acronym (ACoS, RoAS, CTR, CPC, CVR, ASP, etc.), the acronym + concept-level definition stays in the glossary; only the formula moves to the page.

### Why both can be true

Metric acronyms are also industry terms. Readers who see `<Term>ACoS</Term>` in body text want to know "what does that acronym stand for and what's it measuring?" — that's a job for the glossary tooltip. Readers reading a dashboard page want to know "for THIS view, what's the exact formula?" — that's a job for the page's Metrics table. Both questions are valid; they have different answers; the answers live in different places.

### Examples — terms vs metrics

| Entry | Term in glossary? | Metric on page? |
|---|---|---|
| ASIN | Yes (identifier) | No |
| Marketplace | Yes (concept) | No |
| Sponsored Display (SD) | Yes (ad-type category) | No |
| Buy Box | Yes (concept — "default offer") | No |
| Impressions, Clicks | Yes (raw counts — no formula) | No |
| Ad Spend, Ad Sales | Yes (attribution definitions, not formulas) | No |
| BSR | Yes (Amazon assigns it — you don't compute it) | No |
| bps, PoP, YoY | Yes (comparison methods) | No |
| **ACoS** | Yes (acronym + concept-level "measures ad efficiency") | **Yes** (formula on page) |
| **TACoS, RoAS, CTR, CPC, CVR, ASP, Ordered Revenue, Return Rate, DPV** | Same pattern — acronym + concept in glossary | **Yes** (formula on page) |

### Format of the Metrics section on a dashboard page

Every dashboard page (Power BI dashboard guide, Looker Studio template guide) that uses derived metrics gets a `## Metrics` H2 section near the end of the page — **after** the body content (Tabs, Accordions, capability tables) and **before** any horizontal rule + footer section ("Where to go next", `## ⚙️ For analysts & developers`, related-articles cards).

```mdx
## Metrics

Formulas used in this dashboard. Concept-level definitions for acronyms live in the [Glossary](/help-center/glossary).

| Metric | Formula / definition | Notes |
|---|---|---|
| **ACoS** | Ad Spend ÷ Ad Sales × 100 | Lower is more efficient |
| **RoAS** | Ad Sales ÷ Ad Spend | Inverse of ACoS, expressed as a multiplier |
| **CTR** | Clicks ÷ Impressions × 100 | |
| **CPC** | Ad Spend ÷ Clicks | |
| **CVR** | Orders from Ads ÷ Clicks × 100 | Attribution per Amazon's 14-day post-click window |
```

The first cell wraps the metric in bold (`**ACoS**`) rather than `<Term>` — inside the Metrics table, the page is **already** the canonical formula reference for that metric, so a tooltip would be circular. Use `<Term>` in body prose elsewhere on the page (first occurrence only), and bold in the table.

### Context-specific formulas — same metric, different page

Formulas vary by dashboard. Don't try to harmonize them — each dashboard has the right formula for its data:

- **Seller-only ACoS** uses Seller Ad Spend ÷ Seller Ad Sales.
- **Vendor-only TACoS** has two flavors: Ordered Revenue basis and Shipped COGS basis.
- **Seller + Vendor combined ACoS** sums Ad Spend across accounts; TACoS has both Ordered Revenue basis AND Earned Revenue basis listed separately.
- **DSP RoAS** uses Total Cost (not Ad Spend) and Total Sales over a 14-day attribution window.
- **ASP** has at least three flavors: Seller (Sales ÷ Units), Vendor Ordered Revenue basis, Vendor Earned (AWP).

Don't collapse these in one shared definition — the whole point of moving formulas to the page is so each dashboard's table is unambiguous.

### Adding a new metric (workflow)

1. Add the acronym to `lib/glossary.ts` with a concept-only `short` definition: what it measures, what it's used for, why it matters. **No formula.** End with "See the dashboard page for the formula used in that view."
2. Add a matching H3 in `content/help-center/glossary.mdx` with the same concept-only definition.
3. On the dashboard page where the metric appears, add a row to the `## Metrics` table with the formula in the format `Numerator ÷ Denominator` (Unicode `÷`, with spaces). Use `×` for multiplication, never `*`.

### Adding a new term (no formula)

Same as before — edit `lib/glossary.ts`, add a matching H3 in `glossary.mdx`. Do NOT redefine on individual pages — the `<Term>` tooltip carries the definition wherever it's used.

### Anti-patterns

- **Don't put a formula in the glossary.** `ACoS = Ad Spend ÷ Ad Sales × 100` belongs on the page, not in `lib/glossary.ts`.
- **Don't redefine a term on a page.** If the page wraps `<Term>ASIN</Term>`, that's the definition surface. Adding a "What is an ASIN?" paragraph duplicates the glossary.
- **Don't add `<Term>` inside the Metrics table.** Bold the metric name; the table itself is the definition.

### Three-way separation: Glossary, Metrics, For analysts

Every piece of metric-related content on a dashboard page belongs in exactly one of three places. If you find yourself writing the same thing twice, you're using the wrong section for one of them.

| Surface | Answers | Example content |
|---|---|---|
| **Glossary** (`lib/glossary.ts` + `glossary.mdx`, surfaced via `<Term>X</Term>` tooltips) | "What is X? What does the acronym stand for?" | "ACoS — Advertising Cost of Sales. A metric that measures ad spend efficiency. See the dashboard page for the formula used in that view." |
| **`## Metrics`** (one section per dashboard page) | "How is X computed on THIS dashboard?" | `\| **ACoS** \| Ad Spend ÷ Ad Sales × 100 \| Lower is more efficient \|` |
| **`## For analysts: data sources & methodology`** (one section per dashboard page) | "Where does X's underlying data live and how do I work with it directly?" | Dataset paths (`SELLING_PARTNER.SELLER_TRAFFIC`), column references, attribution windows (14-day post-click), transaction-status filters, currency conversion notes, SQL snippets, why this dashboard's calculation differs from a sibling dashboard's |

**Rules:**

1. **A concept-level term definition lives in the glossary, period.** If you write "ACoS measures how efficient your ads are" anywhere outside `lib/glossary.ts` and `glossary.mdx`, delete it — the `<Term>` tooltip is the definition surface.
2. **A formula lives in the page's Metrics table, period.** If you write "ACoS = Ad Spend ÷ Ad Sales × 100" anywhere outside the `## Metrics` table, delete it (including from the dev section).
3. **Data plumbing lives in the dev section, period.** Table paths, column names, attribution windows, SQL snippets, dashboard-specific edge cases — none of these belong in the glossary or the Metrics table.

When refactoring a page that already mixes content across sections (especially old pages), prune from the bottom up: any concept-level definitions in the dev section move to the glossary (if not already there); any formula restatements in the dev section get deleted (the Metrics table is the canonical source); what's left in the dev section should be pure data plumbing.

### What goes in "For analysts: data sources & methodology"

A well-scoped dev section contains:

- **Source tables** — which Snowflake / BigQuery tables this dashboard reads from (e.g., `FINANCE.FINANCE_PROFIT_LEDGER`, `ADVERTISING.AMZN_AD_GROUP_DAILY`)
- **Column mapping** — which columns power which dashboard fields, where it isn't obvious
- **Attribution rules** — the specific windows / models used for this dashboard's data (14-day post-click for DSP, 24-hour session boundary for traffic, accrual vs recorded basis for finance)
- **Edge cases** — what's included or excluded (returns, deferred transactions, transaction-status filters, marketplace currency conversions, sourcing vs manufacturing views for Vendor)
- **Cross-dashboard differences** — why this dashboard's number doesn't match another dashboard's number for the same metric (e.g., "Seller-only TACoS uses Ordered Product Sales; Seller+Vendor combined TACoS uses Total Ordered Revenue")
- **SQL examples** — short queries showing how to reproduce a chart from the warehouse

A well-scoped dev section does NOT contain:

- Restated formulas (those are in `## Metrics`)
- Restated concept definitions (those are in the glossary)
- Generic Amazon/Walmart terminology (also in the glossary)

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

**When to use:** wrap a section in `<Steps>` if BOTH of these are true:
1. The reader is supposed to perform actions in a specific order (clicks, inputs, navigation).
2. There are at least 2 actions in the section.

Sections describing what the reader will *see* on a screen (reference content, panel descriptions, capability tables) stay as prose or bullet lists. Single-click sections also stay as prose — wrapping `<Steps>` around one action is overkill.

**Anti-pattern (don't do this):**

```mdx
## Update your password
- Click Settings → Account
- Click Change password
- Enter old and new passwords
- Click Save
```

**Correct pattern:**

```mdx
## Update your password

<Steps>

<Step>
### Open Account settings
Click **Settings → Account**.
</Step>

<Step>
### Open the change-password dialog
Click **Change password**.
</Step>

<Step>
### Enter your passwords and save
Type your current and new password. Requirements: 6+ characters, one uppercase, one lowercase, one number. Click **Save**.
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

## 10. Tabs — for parallel content selected by context

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

### When to use Tabs

**Use Tabs whenever possible** when two or more sections cover the same topic but differ by one selectable axis — typically:

- **Platform** — Amazon / Walmart
- **Account type** — Seller / Vendor (Amazon), or 1P / 3P (Walmart)
- **Region** — US / EU / Far East when the steps materially differ
- **Method** — URL / ASIN / CSV / Brand Selection for the same action

If a section reads "X for Amazon" and the next section reads "X for Walmart" with mostly the same content, that's a Tabs candidate. Convert it.

### Why it matters

- The page is roughly half (or less) the vertical height — only one tab body renders at a time.
- Readers self-identify with their tab and stop reading content that doesn't apply to them.
- The TOC stays focused on the topic itself instead of having two near-duplicate entries ("X for Amazon", "X for Walmart").

### Anti-pattern (don't do this)

```mdx
### What data does DataHawk collect from Amazon?
- brand
- title
- ASIN
- A+ status
…

### What data does DataHawk collect from Walmart?
- brand
- title
- Item ID
- Walmart+ status
…
```

Two parallel H3s with 90 %-identical bullet lists. Vertical sprawl, duplicated maintenance, and the TOC now has two near-duplicate entries.

### Correct pattern

```mdx
### What data does DataHawk collect?

For each tracked product, DataHawk captures a daily snapshot of dozens of attributes. The fields vary slightly between marketplaces — pick your platform.

<Tabs items={['Amazon', 'Walmart']}>

<Tab value="Amazon">

- brand
- title
- ASIN
- A+ status
…

</Tab>

<Tab value="Walmart">

- brand
- title
- Item ID
- Walmart+ status
…

</Tab>

</Tabs>
```

One H3, one TOC entry, half the visible height.

### When NOT to use Tabs

- The differences are too small to bother — a single-line difference can stay as a parenthetical note in prose.
- The reader needs to **compare side by side** — Tabs hide everything but the active tab. Use a markdown table instead.
- One option is clearly the recommended path and the others are edge cases — write the recommended path in prose and mention the alternatives briefly.

### Tab label conventions

- **Plain text only** — labels are a string prop (`items={['…']}`), so no markdown, no `<code>`, no `<Term>`.
- **Sentence case**, 1–3 words: `URL`, `ASIN / Walmart ID`, `CSV Import`, `Brand Selection`.
- Keep labels short — long labels wrap on mobile and look messy.

### One-line rule

**If you find yourself writing two H2 or H3 sections whose only meaningful difference is the platform / account type / method, stop and convert them to Tabs instead.**

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

### Emojis

**Never add emoji to MDX text content.** No emoji in prose, headings, bullets, tables, link text, Card titles, Tab labels, or any other reader-facing string you type into a `.mdx` file.

The only places emoji legitimately appear in this repo:

- **Callout icons** — auto-rendered by the `<Callout>` component (💡 for info, ⚠️ for warn, ❌ for error, ✅ for success). These live in `mdx-components.tsx`, not in MDX content. You never type them into MDX yourself — picking `type="warn"` is enough.
- **`## ⚙️ For analysts & developers` headings** — an established marker for the developer-only section on dense reference pages. Don't introduce new `⚙️`-marked headings on pages that don't already use the pattern.

Specifically, don't do any of the following in MDX:

- ✅ / ❌ inside comparison tables to mean "yes / no" — use plain text (`Yes`, `No`, `Not available`).
- ⚠️ inline next to warnings — use a `<Callout type="warn">` instead, the component supplies the icon.
- → / ✔ / • as custom bullet markers — use standard markdown bullets (`-`).
- 📌 / 🎯 / 🚀 / etc. anywhere — no decorative emoji in body text.

### Describing public-data collection — mechanism-agnostic only

DataHawk sources data two ways. Each has its own writing rule.

**Private data** — customer connects their own Amazon Seller / Vendor / Advertising or Walmart Marketplace account via OAuth. This side is fully sanctioned, and the docs can be explicit about the mechanism: name the APIs (`SP-API`, Amazon Advertising API, Walmart Marketplace API, Walmart Connect API), describe authentication, describe data freshness in technical terms.

**Public data** — DataHawk monitors publicly visible product, keyword, and category information for tracked items. Customer-facing prose must describe this in **mechanism-agnostic language**. Use *track, monitor, collect, observe, retrieve publicly available information, public-data collection, daily collection*. Never use *crawl, crawler, crawling, scrape, scraper, scraping, spider, harvest, bot, parse the page, extract the page, fetch the page, visit each page, automated visit*.

The reason: Amazon and Walmart don't formally permit automated visiting of their listing pages, so documentation that describes the mechanism explicitly creates risk. The customer outcome ("DataHawk tracks public listings so you can monitor competitor pricing and rank") is the same; only the language describing how we get there changes.

Quick reference:

| Don't write | Do write |
|---|---|
| "DataHawk crawls public pages daily" | "DataHawk collects public page data daily" |
| "Crawled per keyword, per marketplace" | "Collected per keyword, per marketplace" |
| "Classic scraping collection" | "Classic public-data collection" |
| "Our proprietary crawling infrastructure" | "Our proprietary collection infrastructure" |
| "More reliable than its crawling counterpart" | "More reliable than its public-data tracking counterpart" |

This rule applies to **all customer-facing surfaces**: MDX page bodies, frontmatter `description` fields, changelog entries, glossary definitions, Callouts, image alt text, and any component string a reader can see. Internal developer comments inside `.tsx` / `.ts` code files are not customer-facing — they can use whatever language is clearest.

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

### Folder index conventions (three rules)

These three rules apply to **every folder that has both a `meta.json` and an `index.mdx`**:

1. **Always include `"index"` first in the `pages` array.**

   ```json
   { "title": "Send data to your tool",
     "pages": ["index", "powerbi", "looker-studio", ...] }
   ```

   Omitting `"index"` makes the introduction page invisible in the sidebar even though the folder toggle still appears — readers can't navigate to it.

2. **`meta.json` `title` reflects the folder's general purpose**, not a specific page inside it. Take the cue from the folder name and the index content. Example:
   - `content/help-center/connect-tools/` → `"Send data to your tool"` (covers what the whole section does)
   - `content/help-center/powerbi-dashboards/` → `"Explore Power BI Dashboards"`
   - `content/help-center/data-setup/` → `"Set up data"`

   This title is what the user sees as the sidebar toggle label, so it should describe the whole section, not echo the index page title.

3. **`index.mdx` frontmatter `title` is always `Introduction`.**

   ```mdx
   ---
   title: Introduction
   description: ...
   ---
   ```

   This avoids the "same name twice" duplication where the folder toggle and its first child item read identically (e.g. "Send data to your tool ▸ Send data to your tool"). With `Introduction` as the index title, the sidebar reads cleanly:

   ```
   ▾ Send data to your tool        ← from meta.json
      Introduction                  ← from index.mdx
      Connect to Power BI
      Connect to Looker Studio
      ...
   ```

   The H1 on the index page itself also renders as "Introduction" — that's the intended effect; the folder toggle gives the contextual category.

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
