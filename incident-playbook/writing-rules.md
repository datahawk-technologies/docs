# Writing an incident entry

Read this before creating or editing anything in `content/incidents/`. It covers
what the Incidents page is for, the file contract, and the rules that govern the
wording. The general repo rules in `CLAUDE.md` still apply on top of this - this
file only adds what is specific to incidents.

Input is a filled `incident-playbook/intake-template.md`. Output is one `.mdx`
file in `content/incidents/`. Use `.mdx`, not `.md`: every entry in the folder is
`.mdx`, and the schema and the rule checker are written against that extension.

Section 2b lists the six inputs an entry can't be written without, and what to do
when one of them is missing. Read that before deciding you have enough.

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

**What they see first.** A status banner above the list, before any entry. It
reads "No incidents in progress" when nothing is open, and turns blue and names
each open incident when something is. Its state is derived from the `status`
field of the entries themselves (section 3), so there is nothing to switch on or
off by hand and the banner cannot disagree with the list beneath it.

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

**Once published, the filename is frozen.** It is the entry's URL, and the URL is
its RSS `guid` - the one thing that tells a subscriber's reader "this is the item
you already have". Rename it and the reader shows a second copy while the first
sits there saying "In progress" forever, support's pasted links 404, and the
entry loses its search history. So an entry published while still open keeps its
original date and filename when it closes, even though that date is now the
publication date rather than the resolution date. Record the resolution with
`updated` and the in-body update line instead.

**Frontmatter** - every field is required:

```mdx
---
title: "Weekend outage caused permanent loss of snapshot-based data"
description: "A data collection outage over August 30 and 31 permanently affected snapshot-based datasets, including FBA inventory."
date: "2026-08-31"
updated: "2026-09-04"        # optional - only when revising a published entry
dateRangeImpacted: "Aug 30 - Aug 31, 2026"
datasetsImpacted: ["Raw Inventory (FBA)", "other snapshot-based datasets"]
status: "resolved-data-unrecoverable"
severity: "major"
---
```

| Field | Rules |
|---|---|
| `title` | What happened, in plain words. No date in the title - the page shows it. Quote the string. |
| `description` | One sentence, 160 characters max, quoted. Appears in the list, in search results, and in the RSS item. |
| `date` | `"YYYY-MM-DD"`, must match the filename prefix. Drives ordering everywhere. Set once, at publication - never changed afterwards. |
| `updated` | Optional `"YYYY-MM-DD"`. Omit on a new entry. Set it when you materially revise a published one - closing an `in-progress` incident, or a backfill landing. It moves the entry's RSS `pubDate`, which is what re-surfaces it for subscribers who already received it. |
| `dateRangeImpacted` | The *data* dates affected, human-readable: `"Aug 30 - Aug 31, 2026"` or `"Sep 10, 2026"`. Use a hyphen, not an en dash. |
| `datasetsImpacted` | Array. Exact table names where customers query them, plain-English names otherwise. Never empty. If only part of a dataset or only some marketplaces were hit, the array still names the dataset - the body carries the "partial" and "US and Canada only" detail. |
| `status` | One of `"in-progress"`, `"resolved-no-data-impact"`, `"resolved-data-unrecoverable"`. See section 3 - this is the field customers care most about. |
| `severity` | One of `"low"`, `"minor"`, `"major"`. See section 3b. |

**Body shape:**

1. An opening paragraph in prose - never a heading first, and don't repeat the
   description verbatim. Say what happened, when we spotted it, and when it was
   fixed. Those two dates are what a reader checks to see how long we sat on it.
2. `## What this means for you` - the practical impact: which data, which dates,
   what they'll see.
3. `## What we are doing about it` - the fix, the safeguard, and what the reader
   should do next.

Section names can flex when the entry genuinely needs it (`## What was genuinely
affected` fits an entry that's mostly a false alarm), but the order - what
happened, what it means for you, what we're doing - stays.

**Length:** 150-250 words. Minimal verbosity is the house style here: what
happened, what it means for the reader, what to do, stop. An entry that needs
much more is usually hiding a troubleshooting page inside it - write that page
and link to it.

**Short form for `severity: "low"`.** A low-severity entry doesn't need the
three-part shape. Two to four sentences in one block is right: what was affected,
which dates, that it's resolved, and whether the reader needs to do anything. No
`##` headings, no cause, under about 80 words. The aim is a notice, not a report -
the reader rules themselves in or out and moves on. Frontmatter is unchanged:
every field is still required, and the facts block still renders above the text.

Don't add `<PageFeedback />`, don't import components, and don't touch
`content/incidents/meta.json` - new files are picked up automatically and sorted
by date. The status banner at the top of `/incidents` is derived the same way:
there is no banner file to edit and no copy to write for it. Set `status`
correctly and the banner follows.

---

## 2b. Required inputs, and what to do when one is missing

Six inputs have to be settled before an entry is publishable. Each maps to the
intake form on one side and the frontmatter or body on the other.

| Input | Where it lands | If you don't have it |
|---|---|---|
| **Detection date** - when we spotted it | Opening paragraph | Use the first date a customer could have seen the symptom and write "identified on". Never leave the reader guessing how long we knew. |
| **Resolution date** - when it was fixed | Opening paragraph, plus `date` and the filename prefix | Not fixed yet is `status: "in-progress"` and no resolution date. Publish anyway - that's what the status is for. |
| **Impacted datasets**, and whether the hit was partial or region-scoped | `datasetsImpacted` plus the body | Don't publish a vague list. Name the surface you are sure of, say the full scope is still being confirmed, and set `status: "in-progress"`. |
| **Impacted data date range** | `dateRangeImpacted` | If the end is still open, write an open range ("From Sep 11, 2026") and keep `status: "in-progress"`. |
| **Impact** - delay, wrong values, or permanent loss, with its scope | `status` plus the body | Unknown means `in-progress`. Never guess the data outcome in either direction. |
| **Severity** | `severity` | Take the lower of the two levels you are torn between (section 3b) - unless the data is permanently lost, which is always `major`. |

**Never invent a missing value.** If an input is missing and the fallback above
doesn't fit, say plainly what is missing and ask for it - don't quietly write
around it. If two or more are missing, the entry isn't ready: ask first, write
second.

**Cause is not always required.** Permanent data loss always needs one, a `low`
severity entry never does, and everything else needs one only when it ran longer
than 48 hours or could recur. Section 3c has the table.

---

## 3. Status

This is the one thing the page promises to get right. Everything else is context.

| Value | Use when |
|---|---|
| `in-progress` | We know something is wrong and it is not fixed yet. Publish before you have the full story. |
| `resolved-no-data-impact` | Fixed, and the data is complete and correct now - delayed then caught up, wrong then corrected, or never touched (an access outage). |
| `resolved-data-unrecoverable` | Fixed, but some part of the affected data cannot be reconstructed, however small. |

Rules that decide the edge cases:

- **Partial loss is `resolved-data-unrecoverable`.** Then state precisely what came back and what did not.
- **"We could backfill it but haven't" is `resolved-data-unrecoverable`** until the backfill actually runs. Change the status when it does.
- **Unknown at publish time is `in-progress`,** not a guess at the outcome. This is the point of having the status: you can tell customers on day one and settle the data question later.
- **Wrong values that were corrected is `resolved-no-data-impact`** - nothing was lost, the numbers were briefly wrong.

**`in-progress` also drives the banner.** The top of `/incidents` shows an
overall status read from this field: green "No incidents in progress" when no
entry carries it, blue and naming each open incident when one or more do. Setting
`in-progress` is therefore a site-wide announcement, and clearing it is what takes
the announcement down.

An `in-progress` entry is a promise to come back to it. Don't open one you won't
close: when the incident resolves, update the status, the body, and add a dated
line saying what changed (see "Updating a published entry" in section 4). A
forgotten `in-progress` entry now costs more than a stale page - it leaves a
banner up telling every reader something is broken when it isn't.

Never round this in our favor. The entire value of this page is that a customer
can trust the status without asking us.

---

## 3b. Severity

How much this mattered, in one word. It is separate from `status`, and the two
answer different questions: `status` is "is my data gone?", severity is "how much
did this cost me?".

- **`major`** - data is permanently lost, or the disruption was wide enough that
  customers have to act. Should stay rare; if everything is major, nothing is.
- **`minor`** - real, customer-visible impact that is now resolved. Data was
  delayed and caught up, values were wrong and were corrected, access broke and
  was restored.
- **`low`** - narrow and brief. One dataset, a short window, a small subset of
  customers, and nothing anyone needs to do.

The two fields are mostly independent, with one hard coupling: **permanent data
loss is always `major`**. If `status` is `resolved-data-unrecoverable`, severity
is `major` - the rule checker enforces it. Losing a piece of a customer's history
for good is never a small thing, however narrow the window.

Everywhere else they move separately. A platform-wide delay that fully recovered
is `resolved-no-data-impact` but still `severity: "minor"`.

When you are torn between two levels, pick the lower one and make the body carry
the detail. Overstating severity trains people to ignore the field.

---

## 3c. When an explanation is required

"Explanation" here means the cause - why it happened - not just what happened.

| Case | Explanation |
|---|---|
| `status: "resolved-data-unrecoverable"` | **Required, always.** Data is gone for good, so the reader is owed the reason however fast we fixed it. This overrides the 48-hour rule below. |
| `severity: "low"` | **Not needed.** The entry exists to say it happened and it's handled. Don't pad it with a cause nobody asked for. |
| Everything else | Optional when the incident was resolved within 48 hours. Required when it ran longer than that, or when it could recur. |

These cases never collide: permanent loss is always `major` (section 3b), so an
entry can't be both `low` and unrecoverable.

One sentence usually does it - "an overlapping window during a migration counted
some orders twice". Keep the internal architecture out of it (section 4).

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
- Say whether a dataset was hit fully or partially, and name the regions when
  only some were affected ("US and Canada only", "a share of rows, not all").
  "The dataset was affected" sends every customer to support to find out whether
  that means them.
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

Facts change: a backfill runs, an investigation concludes, an `in-progress`
incident closes. Edit the entry and say what changed ("Update, Sep 20: the
August 20 gap has been backfilled"). Don't silently rewrite history, and don't
change `status` without a line explaining it.

Closing an `in-progress` entry is four edits to the same file, and no fifth:

1. `status` - to the resolved value that's actually true.
2. The body - the opening paragraph gains the resolution date, and a dated update
   line says what changed.
3. `updated` - the date of this revision. This moves the entry's RSS `pubDate`, so
   subscribers who already have the item see it again as resolved rather than
   keeping a stale "In progress" copy.
4. `severity`, if the outcome turned out worse than first published (permanent
   loss is always `major`).

Do not rename the file, and do not touch `date`. The filename is the entry's URL
and its feed identity - see section 2.

Then load `/incidents` and confirm the banner went back to all-clear, or dropped
this incident if others are still open. Closing the entry is what clears the
banner; nothing else does.

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
status: "resolved-no-data-impact"
severity: "minor"
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

- [ ] All six required inputs settled, or the missing ones raised rather than guessed (section 2b)
- [ ] Frontmatter complete, `date` matches the filename prefix, `description` at most 160 characters
- [ ] Detection and resolution dates appear in the opening paragraph
- [ ] Partial and regional scope stated where the hit wasn't total
- [ ] `status` is honest by section 3, and the body matches it
- [ ] `severity` is set by section 3b, and is the lower level when it was a close call
- [ ] Permanent loss carries an explanation of the cause, and `severity` is `major` (sections 3b, 3c)
- [ ] A `low` severity entry uses the short form and skips the cause (sections 2, 3c)
- [ ] No customer, company, workspace ID, or employee name anywhere
- [ ] Exact dates and dataset names - a reader can decide "was I affected?" without asking
- [ ] The entry ends with a next step, even if that step is "nothing to do"
- [ ] No internal system names, no crawl/scrape language, no emoji, American English
- [ ] `node scripts/check-content-rules.mjs --all` reports no errors for the new file
- [ ] `pnpm dev`, then check `/incidents` - the entry appears in the list with the right badge, the banner at the top matches (all-clear, or naming this incident when it's `in-progress`), and `/incidents/feed.xml` includes it
- [ ] Revising a published entry: filename and `date` untouched, `updated` set to today
- [ ] Someone on CS reads the wording before it merges

Publishing the entry is not the whole job. Post it in `#cs` too, so support knows
it exists before a customer asks.
