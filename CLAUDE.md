# DataHawk Docs — Conversion Rulebook for Claude Code

You are an agent working inside the DataHawk Fumadocs documentation repository. This file describes the conventions you MUST follow when authoring or editing MDX content. Read it carefully — these rules were established through iteration and exist for specific reasons.

---

## 1. Repository overview

This is a **Fumadocs UI 16.x** docs site running on **Next.js 16.x** with **pnpm**. Pages live in `content/` as MDX. There are four top-level tabs, each backed by a content folder:

- `content/welcome/` → Welcome tab (overview, getting-started)
- `content/help-center/` → Help Center tab (the bulk of the docs)
- `content/troubleshooting/` → Troubleshooting tab
- `content/api-reference/` → API Reference tab (currently hidden)

The corresponding `app/{tab}/[[...slug]]/page.tsx` routes render those pages. Each page.tsx imports the custom `mdxComponents` from `@/mdx-components` and passes it to the MDX renderer — so all registered components are globally available without per-file imports.

---

## 2. The cardinal rule — NEVER import these in MDX

The following components are registered globally in `mdx-components.tsx` at the repo root. They are available in EVERY MDX file automatically. **Importing them at the top of an MDX file will SHADOW the global registration** and break the custom Callout emoji icons (and any other future overrides).

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
```

The component tags (`<Callout>`, `<Cards>`, etc.) DO work — just don't import them.

**To verify a converted MDX file is clean:**

```bash
grep "from 'fumadocs-ui/components/" content/path/to/file.mdx
```

Expected output: nothing.

---

## 3. Frontmatter format

Every MDX file MUST start with frontmatter:

```mdx
---
title: Page Title Here
description: One-sentence description that appears under the H1 and in search results.
---
```

- `title` is required, will render as H1 — so the MDX body should NOT start with `#` heading
- `description` is required, keep it under 160 characters

Optional fields:

```mdx
---
title: Page Title
description: Description text.
full: true   # use for landing pages that don't need a sidebar TOC
---
```

---

## 4. Callout — use emoji icons, never import

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

Notion callouts map to these as follows:

| Notion icon | MDX `type` |
|---|---|
| 💡 lightbulb / blue info | `info` |
| ⚠️ warning / yellow | `warn` |
| 🚨 / 🛑 / ❌ red | `error` |
| ✅ green check | `success` |
| Anything else | `info` (default) |

---

## 5. Cards — always wrap in `<div className="card-grid">`

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

If a Notion page's content reads like a hub/index (links to sub-pages with short descriptions), convert to Cards. If it reads like a procedure, convert to Steps (see next section).

---

## 6. Steps — for numbered procedures

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

**Do not put links in Step headings** — Fumadocs auto-wraps headings in anchor tags, and nesting an `<a>` inside an `<a>` causes a hydration error. If a step needs a "Read more" link, put it BELOW the heading:

```mdx
<Step>

### Configure your Amazon account

Brief description of what this step covers.

[Read the full guide →](/help-center/data-setup/seller-account)

</Step>
```

---

## 7. Accordion — for FAQs and collapsibles

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

Use when Notion has toggle blocks or "show more" patterns.

---

## 8. Tabs — for content that varies by context

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

Use when Notion has parallel sections that only differ by platform/role/version.

---

## 9. Images

Notion image URLs (`https://prod-files-secure.s3...`) WILL expire and break. For migration:

1. **Try to download the image** into `public/images/{section}/` and reference it as `/images/{section}/filename.png`
2. **If you can't download**, leave a placeholder and a comment for Christine:

```mdx
{/* TODO: Replace this Notion image with a local copy in /public/images/{section}/ */}
![Description](https://prod-files-secure.s3.us-west-2.amazonaws.com/...)
```

Always include alt text.

---

## 10. Code blocks

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

## 11. Internal links

Convert all `docs.datahawk.co/Page-Name-{hash}` URLs to local Fumadocs paths from the spreadsheet's MDX path column.

Example:

- Notion URL: `https://docs.datahawk.co/Manage-your-Account-33b4aa5f57fa801e9f98cf4822282f93`
- Find that URL in `content-structure.csv`
- Convert MDX path `content/help-center/datahawk-app/account-management.mdx` → web path `/help-center/datahawk-app/account-management`
- Use `[Manage your Account](/help-center/datahawk-app/account-management)` in MDX

**Always strip the `content/` prefix and the `.mdx` extension** when converting MDX paths to URL paths. `index.mdx` becomes the folder root URL.

---

## 12. Headings hierarchy

- H1 comes from frontmatter `title` — DO NOT write `# Heading` at the top of the body
- Start the body with H2 (`##`) for top-level sections
- Use H3 (`###`) for sub-sections, H4 (`####`) sparingly
- Avoid H5/H6 — restructure the content instead

---

## 13. Notion-specific patterns to translate

| Notion pattern | Fumadocs MDX equivalent |
|---|---|
| Callout block (any color) | `<Callout type="...">` — match the color/intent |
| Toggle block | `<Accordion title="...">` inside `<Accordions>` |
| Sub-page link tiles / "child page" blocks | `<Card>` inside `<div className="card-grid">` |
| Bookmark to external URL | Plain markdown link `[label](url)` |
| Synced block / Database view | NOT supported in MDX — replace with regular content or a Card grid |
| Equation block | Inline as code, or use a remark-math plugin (not currently installed) |
| Video embed (YouTube/Loom) | `<iframe src="..." />` — but ideally upload to a hosted spot first |
| Image | Download to `/public/images/...` and link locally (see section 9) |
| File attachment | Upload to `/public/files/...` and link |

---

## 14. File location convention

Use the **MDX path** column from `content-structure.csv` as the literal target. The agent must create any missing parent directories.

Examples:
- `content/help-center/datahawk-app/account-management.mdx` → file at that exact path
- `content/help-center/datahawk-app/index.mdx` → the section index page (rendered at `/help-center/datahawk-app`)

Each folder containing MDX files needs a `meta.json` to control sidebar ordering. If a folder doesn't have one, create:

```json
{
  "title": "Section Title",
  "pages": ["index", "page-1", "page-2"]
}
```

The `pages` array controls the order in the sidebar. List MDX filenames without the `.mdx` extension. `index` is always first if present.

---

## 15. The migration loop (when running content-structure.csv)

For each row in the CSV:

1. Skip if Status is `LIVE`
2. Skip if Notion URL is empty (these are landing pages — they need different treatment)
3. Read the Notion page via the Notion MCP using the URL
4. Convert content following rules 1–14 above
5. Write the MDX file to the path in column E (create parent directories as needed)
6. If the file's parent folder lacks a `meta.json`, create one
7. Update the CSV row's Status column from `NOT CREATED` to `LIVE`
8. Every 10 pages, write a brief summary to the user and pause for spot-checking

**Pages with empty Notion URL but listed as LIVE** are hand-written landing pages (like `content/welcome/getting-started/index.mdx`). LEAVE THEM ALONE.

**Pages with Status IN PROCESS** — read the existing file at the MDX path first, understand what's there, then decide whether to overwrite or merge. Default to merging.

---

## 16. Quality bar before marking a page LIVE

A converted page passes if:

- ✅ Frontmatter has `title` and `description`
- ✅ Body starts with H2, not H1
- ✅ No `import { ... } from 'fumadocs-ui/components/...'` lines
- ✅ All Notion-style URLs (`docs.datahawk.co/...`) replaced with local Fumadocs paths from the CSV
- ✅ Callouts use the right `type` for their intent
- ✅ Numbered procedures are wrapped in `<Steps>`
- ✅ Sub-page link clusters are wrapped in `<div className="card-grid">` + `<Card>`
- ✅ The file is at the exact path the CSV specifies
- ✅ The parent folder has a `meta.json` if needed

If any of these fails, leave Status as `IN PROCESS` and write a note in the Notes column instead of marking LIVE.

---

## 17. When in doubt

- **Faithful 1:1 conversion** — don't rewrite content. Just structurally translate Notion → Fumadocs.
- **Ask before deleting** — if a Notion block doesn't translate cleanly, leave it as MDX comment `{/* original block content */}` rather than dropping it silently.
- **Verify with `pnpm dev`** — if the user reports a build error, read the terminal output to find the exact file and line.

---

End of rulebook. These conventions apply to every MDX file in the repo.
