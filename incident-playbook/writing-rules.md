# Writing an incident entry

Read this before creating or editing anything in `content/incidents/`. It covers
what the Incidents page is for, the file contract, and the rules that govern the
wording. The general repo rules in `CLAUDE.md` still apply on top of this - this
file only adds what is specific to incidents.

Input is a filled `incident-playbook/intake-template.md`. Output is one MDX file
in `content/incidents/`.

---

## 1. What this page is

The Incidents page is a public log of times DataHawk data was missing, wrong,
late, or unreachable - and whether we got it back.

It exists because a customer once found a two-day hole in their FBA inventory
history on their own and asked, fairly, why nobody had told them. The page is our
answer: a place a customer can check, on their own, whether a gap they're staring
at is something we already know about.

**Who reads it.** Someone who just noticed their numbers look wrong, and wants to
know in under a minute whether it was us, which dates are affected, and whether
the data is coming back. Often they're technical enough to query a warehouse, but
assume nothing beyond that.

**Where it lives.** `/incidents`. Deliberately not a nav tab - people reach it
from Troubleshooting ("Still stuck?", "Data not refreshing", "Data discrepancies"),
from site search, from an RSS subscription, or from a link support pastes into a
ticket. That placement means the words inside each entry carry the discovery:
if an entry never uses the phrase a worried customer would type, they won't find it.

**Incidents vs Changelog.** The Changelog is for things we did on purpose -
releases, methodology changes, deprecations. Incidents is for things that went
wrong. A planned breaking change is a changelog entry even when it disrupts
someone. An unplanned gap is an incident even when we fixed it in an hour. If
something is genuinely both, write the incident and link to the changelog entry.

---

## 2. The file contract

**Location:** `content/incidents/`
**Filename:** `YYYY-MM-DD-short-slug.mdx`, lowercase kebab-case. The date prefix
must match the `date` frontmatter field. Use the date the incident was resolved
(or the date we're publishing, if still open) - not the date the data broke.

**Frontmatter** - every field is required:

```mdx
---
title: "Weekend outage caused permanent loss of snapshot-based data"
description: "A data collection outage over August 30 and 31 permanently affected snapshot-based datasets, including FBA inventory."
date: "2026-08-31"
dateRangeImpacted: "Aug 30 - Aug 31, 2026"
datasetsImpacted: ["Raw Inventory (FBA)", "other snapshot-based datasets"]
recoverable: false
---
```

| Field | Rules |
|---|---|
| `title` | What happened, in plain words. No date in the title - the page shows it. Quote the string. |
| `description` | One sentence, 160 characters max, quoted. Appears in the list, in search results, and in the RSS item. |
| `date` | `"YYYY-MM-DD"`, must match the filename prefix. Drives ordering everywhere. |
| `dateRangeImpacted` | The *data* dates affected, human-readable: `"Aug 30 - Aug 31, 2026"` or `"Sep 10, 2026"`. Use a hyphen, not an en dash. |
| `datasetsImpacted` | Array. Exact table names where customers query them, plain-English names otherwise. Never empty. |
| `recoverable` | Boolean. See section 3 - this is the field customers care most about. |

**Body shape:**

1. An opening paragraph in prose - never a heading first, and don't repeat the
   description verbatim. Say what happened and roughly why.
2. `## What this means for you` - the practical impact: which data, which dates,
   what they'll see.
3. `## What we are doing about it` - the fix, the safeguard, and what the reader
   should do next.

Section names can flex when the entry genuinely needs it (`## What was genuinely
affected` fits an entry that's mostly a false alarm), but the order - what
happened, what it means for you, what we're doing - stays.

**Length:** 150-300 words. An entry that needs more than that is usually hiding a
troubleshooting page inside it - write that page and link to it.

Don't add `<PageFeedback />`, don't import components, and don't touch
`content/incidents/meta.json` - new files are picked up automatically and sorted
by date.

---

## 3. The recoverable flag

This is the one thing the page promises to get right. Everything else is context.

Set `recoverable: true` when the affected data is complete and correct **now** -
it was delayed and caught up, it was wrong and has been corrected, or the problem
never touched the data at all (an access outage).

Set `recoverable: false` when any part of the affected data cannot be
reconstructed, however small. A narrow permanent gap is still permanent.

Rules that decide the edge cases:

- **Partial recovery is `false`.** Then state precisely what came back and what didn't.
- **"We could backfill it but haven't" is `false`** until the backfill actually runs. Update the entry when it does.
- **Unknown at publish time is `false`**, with a sentence saying the investigation is ongoing. Correct it upward later if the data comes back. Never publish `true` on the hope that it will.
- **Wrong values that were corrected is `true`** - nothing was lost, the numbers were briefly wrong.

Never round this in our favor. The entire value of this page is that a customer
can trust the flag without asking us.

---

## 4. Writing rules

### Never identify anyone

No customer names, company names, workspace IDs, ticket numbers, seller names,
ASINs, SKUs, email addresses, or anything that narrows to one account. No
DataHawk employee names either.

This includes the discovery story. Don't write "a customer reported" or "we were
alerted by a user" - lead with the effect instead. The page describes what
happened to the data, not who noticed it.

### Never sell the company short

State facts plainly and acknowledge the problem once. Not three times, and not
with adjectives.

- No dramatizing: catastrophic, disaster, severe, massive, terrible.
- No minimizing either: tiny, trivial, negligible, nothing to worry about. Both
  failures cost the same thing - the reader stops believing the page.
- One acknowledgment is enough. "We should have flagged this sooner" lands.
  Three apologies in four paragraphs reads as panic.
- When the cause was upstream (Amazon, Snowflake), say so once as fact and move
  on. Don't editorialize, don't hide behind it either.
- Never promise what we can't hold. "This will never happen again" is not
  publishable; "we've added safeguards so overlapping runs can't double-count" is.

### Always give a next step

Every entry ends with something the reader can act on: re-run a query, expect a
backfill by a date, ignore a date range, contact their account team. If there is
genuinely nothing to do, say so outright - "No action needed, your history is
complete" - rather than letting the entry trail off.

### Be precise or the page is worthless

The entry has one job: letting someone answer "was I affected?" without writing
to support.

- Exact dates, exact dataset names. "Some data around the end of August" fails.
- Bound the scope when it's bounded: "only the BigQuery copy - Snowflake was
  correct", "only accounts tracking Walmart".
- Say what was *not* affected when that meaningfully narrows the worry.
- Use the dataset names customers actually query, spelled exactly.

### Don't expose internal plumbing

Describe the effect, not our architecture. No internal job, service, repo,
pipeline, or tool names, no Slack channels, no vendor tooling.

The exception is customer-facing dataset and table names - always exact.

### Language

- Never write crawl, scrape, bot, spider, or harvest about public-data collection.
  Use collect, track, monitor. See `CLAUDE.md` Section 16 - this rule matters more
  here than anywhere, because incidents are usually *about* collection.
- American English. Straight quotes. No emoji. No exclamation marks.
- Past tense for what happened, present for where things stand. Active voice.
  Contractions are fine - the docs use them.

### Updating a published entry

Facts change: a backfill runs, an investigation concludes. Edit the entry and say
what changed ("Update, Sep 20: the August 20 gap has been backfilled"). Don't
silently rewrite history, and don't flip `recoverable` without a line explaining it.

---

## 5. Tone calibration

| Don't write | Write instead |
|---|---|
| "A customer reported a sales spike on Sep 12." | "Sales figures for Sep 11 and 12 were overstated." |
| "We deeply apologize for this catastrophic data loss." | "Snapshot-based data from that weekend could not be recovered." |
| "The EMS training job didn't trigger again." | "A processing job failed to start." |
| "Some data may have been affected around that period." | "Raw Inventory (FBA) has no data for Aug 30 and 31." |
| "This was entirely Amazon's fault." | "Amazon had a cloud outage that delayed data on our side." |
| "This will never happen again." | "We've added safeguards so this duplication can't recur during migrations." |
| "A minor, insignificant gap." | "One sub-category is missing ASINs for Aug 20." |
| "We are working hard to resolve this." | "We expect the backfill to complete by Sep 20." |

---

## 6. Worked example

Intake said:

> Order report double-counted during migration to the new collection system.
> BigQuery share only, internal data fine. Sep 11-12, worst on the 12th. Fixed
> Sep 14 ~noon, figures corrected. Safeguards added. Customer should re-pull.
> One customer asked about it - don't name them.

Which becomes:

```mdx
---
title: "Order data temporarily double-counted for two days"
description: "A migration bug briefly double-counted some orders on Sep 11 and 12, inflating sales figures until it was fixed the same day."
date: "2026-09-14"
dateRangeImpacted: "Sep 11 - Sep 12, 2026"
datasetsImpacted: ["Order and daily sales data (BigQuery Data Sharing)"]
recoverable: true
---

Sales figures for September 11 and 12 came out higher than they should have. We
traced it to a migration of our order collection system: some orders were briefly
counted twice, which inflated sales and units-sold figures for those two days.

## What this means for you

If you pulled order or sales data for September 11 or 12 through BigQuery Data
Sharing before the fix went live, those figures may have been overstated. Nothing
was lost - the underlying order data was correct throughout, only the shared copy
was wrong.

## What we are doing about it

We shipped a fix the same day and corrected the affected figures. We have also
added safeguards so this type of duplication cannot happen again during future
migrations. If you exported those dates before the fix, pull them again - the
numbers are now correct.
```

Note what the intake gave us and the entry doesn't: the customer, the internal
system name, and the fact that a customer found it rather than our monitoring.

---

## 7. Before publishing

- [ ] Frontmatter complete, `date` matches the filename prefix, `description` at most 160 characters
- [ ] `recoverable` is honest by section 3, and the body matches the flag
- [ ] No customer, company, workspace ID, or employee name anywhere
- [ ] Exact dates and dataset names - a reader can decide "was I affected?" without asking
- [ ] The entry ends with a next step, even if that step is "nothing to do"
- [ ] No internal system names, no crawl/scrape language, no emoji, American English
- [ ] `node scripts/check-content-rules.mjs --all` reports no errors for the new file
- [ ] `pnpm dev`, then check `/incidents` - the entry appears in the list with the right badge, and `/incidents/feed.xml` includes it
- [ ] Someone on CS reads the wording before it merges

Publishing the entry is not the whole job. Post it in `#cs` too, so support knows
it exists before a customer asks.
