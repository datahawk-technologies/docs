# Writing an incident entry

Read this before creating or editing anything in `content/incidents/`. It covers
what the Incidents page is for, the file contract, and the rules that govern the
wording. The general repo rules in `CLAUDE.md` still apply on top of this - this
file only adds what is specific to incidents.

Input is a filled `incident-playbook/intake-template.md`. Output is one `.mdx`
file in `content/incidents/`. Use `.mdx`, not `.md`: every entry in the folder is
`.mdx`, and the schema and the rule checker are written against that extension.

Entries are **structured, not narrative**. The body is a fixed set of labelled
lines (section 2c). Prose paragraphs are gone: a reader scans the labels, rules
themselves in or out, and leaves.

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
if an entry never uses the phrase a worried customer would type, they won't find
it. With the body now reduced to labels, the `title`, `description` and
`datasetsImpacted` carry almost all of that weight - write them accordingly.

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
`updated` and the dated update line instead.

**Frontmatter** - unchanged, and every field is still required:

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
| `title` | What happened, in plain words. No date in the title - the page shows it. Quote the string. Do not title entries "Data update": that line belongs in the body, and a list of identical titles is useless in search and in a feed reader. |
| `description` | One sentence, 160 characters max, quoted. Appears in the list, in search results, and in the RSS item. |
| `date` | `"YYYY-MM-DD"`, must match the filename prefix. Drives ordering everywhere. Set once, at publication - never changed afterwards. |
| `updated` | Optional `"YYYY-MM-DD"`. Omit on a new entry. Set it when you materially revise a published one - closing an `in-progress` incident, or a backfill landing. It moves the entry's RSS `pubDate`, which is what re-surfaces it for subscribers who already received it. |
| `dateRangeImpacted` | The *data* dates affected, human-readable: `"Aug 30 - Aug 31, 2026"` or `"Sep 10, 2026"`. Use a hyphen, not an en dash or an em dash. |
| `datasetsImpacted` | Array. Exact table names where customers query them, plain-English names otherwise. Never empty. If only part of a dataset or only some marketplaces were hit, the array still names the dataset - the body's `Scope` line carries the "partial" and "US and Canada only" detail. |
| `status` | One of `"in-progress"`, `"resolved-no-data-impact"`, `"resolved-data-unrecoverable"`. See section 3 - this is the field the banner and the rule checker read. It is not the same thing as the body's `Issue type:` line (section 2c). |
| `severity` | One of `"low"`, `"minor"`, `"major"`. See section 3b. |

---

## 2c. Body template

Every entry uses this shape, at every severity. Nothing else goes in the body:
no opening paragraph, no `##` headings, no components, no closing note.

```mdx
**Data update - Resolved**

Issue type: Incorrect
Period: Sep 11 - Sep 12, 2026
Scope: BigQuery Data Sharing customers, all marketplaces

Datasets:

- `MARKET.ORDERS`
- `MARKET.DAILY_SALES`

Update:

- Cause: An internal processing issue affected order updates.
- Progress: Resolved.
- Historical data: All affected data has been restored or corrected.
- Action: If you exported Sep 11 or Sep 12 before the fix, pull those dates again.
```

**Target length: under 120 words.** If the entry needs more, it's hiding a
troubleshooting page inside it - write that page and link to it from `Action`.

### The header line

`**Data update - Identified**` or `**Data update - Resolved**`, bold, first line,
nothing above it. Plain hyphen, never an em dash or an en dash.

| Frontmatter `status` | Header line |
|---|---|
| `in-progress` | `Identified` |
| `resolved-no-data-impact` | `Resolved` |
| `resolved-data-unrecoverable` | `Resolved` |

`Resolved` here means the incident is closed, not that the data came back. An
entry can read `Resolved` and still say data is permanently gone on the
`Historical data` line. That is the one place the two could be misread as
agreeing, so the `Historical data` line is what carries the truth.

### The four facts lines

| Line | Values |
|---|---|
| `Issue type:` | One of `Delayed`, `Partial`, `Incorrect`, `Unavailable`. What went wrong with the data, not whether it's fixed. |
| `Period:` | The *data* dates. Open range while it's open (`Since Sep 11, 2026`), closed range once bounded (`Sep 11 - Sep 12, 2026`), or a single date. Same dates as `dateRangeImpacted`, written the same way. |
| `Scope:` | Who and where. `All customers`, or narrowed: destination, marketplace, region, subset of rows. Say what was *not* affected here when it meaningfully narrows the worry. |
| `Datasets:` | A bullet list below the label. Backticked `schema.table_name` where customers query them, plain-English names otherwise. Same set as `datasetsImpacted`. |

What the `Issue type` values mean:

- **`Delayed`** - the data is late to be delivered. It is expected to arrive, and
  nothing is wrong with what's already there. `Period` always carries the start
  point (`Since Sep 18, 2026`).
- **`Partial`** - the data is incomplete. A gap is detected: missing days, missing
  rows, missing marketplaces. What is there is correct.
- **`Incorrect`** - the data arrived complete but the values themselves are wrong,
  because the way they were calculated was wrong. Rarely `severity: "low"`, and
  usually `"major"` - see section 3b.
- **`Unavailable`** - a delivery surface (Snowflake, BigQuery, the app) could not
  be reached. The data itself was fine.

Pick one. If two apply, pick the one a customer would notice first and let
`Scope` carry the rest. A delay that has already been caught up is still
`Delayed`; the `Historical data` line is what says it came back.

### The Update block

Four bullets, in this order. `Cause`, `Progress` and `Historical data` use the
set phrases below; don't improvise a variant.

**Cause** - present tense while open, past tense once resolved:

| Open | Resolved |
|---|---|
| We are investigating the cause. | The cause is still under investigation. |
| An internal processing issue is affecting updates. | An internal processing issue affected updates. |
| A confirmed issue with [provider] is affecting source data. | A confirmed issue with [provider] affected source data. |

Omit the `Cause` bullet entirely when `severity` is `"low"` (section 3c).

When `status` is `"resolved-data-unrecoverable"`, the set phrase is not enough:
append one specific sentence saying why, in customer terms. Data is gone for
good, so the reader is owed the reason however fast we fixed it. Keep the
internal architecture out of it (section 4).

**Progress:**

- We are working on a fix.
- We are awaiting provider recovery.
- Resolved.

**Historical data:**

- We are assessing whether affected data can be recovered.
- Missing data is being recovered.
- Incorrect data is being corrected.
- All affected data has been restored or corrected.
- Some data for [dates/datasets] could not be recovered; these gaps are permanent.

The last of those and `status: "resolved-data-unrecoverable"` always travel
together. One without the other is a bug.

**Action** - free text, one sentence, never blank. Re-run a query, expect a
backfill by a date, ignore a date range, contact your account team. When there is
nothing to do, say so outright: `No action needed, your history is complete.`

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
| **Detection date** - when we spotted it | `date` when still open; the dated update line once revised | Use the first date a customer could have seen the symptom. Never leave the reader guessing how long we knew. |
| **Resolution date** - when it was fixed | `date` and the filename prefix; `updated` when closing an open entry | Not fixed yet is `status: "in-progress"`, header line `Identified`, and no resolution date. Publish anyway - that's what the status is for. |
| **Impacted datasets**, and whether the hit was partial or region-scoped | `datasetsImpacted`, plus the `Datasets` and `Scope` lines | Don't publish a vague list. Name the surface you are sure of, write `Scope: still being confirmed` alongside what you know, and set `status: "in-progress"`. |
| **Impacted data date range** | `dateRangeImpacted` and `Period` | If the end is still open, write an open range (`Since Sep 11, 2026`) and keep `status: "in-progress"`. |
| **Impact** - delay, wrong values, or permanent loss, with its scope | `status`, plus the `Issue type` and `Historical data` lines | Unknown means `in-progress` and `Historical data: We are assessing whether affected data can be recovered.` Never guess the data outcome in either direction. |
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

- **Partial loss is `resolved-data-unrecoverable`.** Then state precisely what came back and what did not, on the `Historical data` line.
- **"We could backfill it but haven't" is `resolved-data-unrecoverable`** until the backfill actually runs. Change the status when it does.
- **Unknown at publish time is `in-progress`,** not a guess at the outcome. This is the point of having the status: you can tell customers on day one and settle the data question later.
- **Wrong values that were corrected is `resolved-no-data-impact`** - nothing was lost, the numbers were briefly wrong. The body still reads `Issue type: Incorrect`, and `severity` is still likely `major`; the three fields answer different questions.

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

**`Issue type: Incorrect` is `major` by default**, and never `low`. Wrong values
are worse than missing ones: a gap is visible, a wrong number gets used. Anyone
who pulled those dates has already acted on figures that weren't true, and has to
act again. Drop to `minor` only when the window was narrow enough that the wrong
values were almost certainly never read - corrected within hours, one dataset,
one destination - and say which in `Scope`.

Everywhere else they move separately. A platform-wide delay that fully recovered
is `resolved-no-data-impact` but still `severity: "minor"`.

When you are torn between two levels, pick the lower one and make `Scope` carry
the detail. Overstating severity trains people to ignore the field.

---

## 3c. When an explanation is required

"Explanation" here means the cause - why it happened - not just what happened.

| Case | `Cause` bullet |
|---|---|
| `status: "resolved-data-unrecoverable"` | **Required, always**, and the set phrase alone doesn't satisfy it: add one specific sentence. This overrides the 48-hour rule below. |
| `severity: "low"` | **Omit the bullet.** The entry exists to say it happened and it's handled. |
| Everything else | Set phrase only. Optional when the incident was resolved within 48 hours; required when it ran longer than that, or when it could recur. |

These cases never collide: permanent loss is always `major` (section 3b), so an
entry can't be both `low` and unrecoverable.

---

## 4. Writing rules

The template removes most of the places where tone used to go wrong. What's left
still applies to `Scope`, `Action`, the unrecoverable cause sentence, and the
dated update lines.

### Never identify anyone

No customer names, company names, workspace IDs, ticket numbers, seller names,
ASINs, SKUs, email addresses, or anything that narrows to one account. No
DataHawk employee names either.

This includes the discovery story. Don't write "a customer reported" or "we were
alerted by a user" anywhere, including in an update line. The page describes what
happened to the data, not who noticed it.

### Never sell the company short

State facts plainly. The template acknowledges the problem once, by existing.

- No dramatizing: catastrophic, disaster, severe, massive, terrible.
- No minimizing either: tiny, trivial, negligible, nothing to worry about. Both
  failures cost the same thing - the reader stops believing the page.
- No apologies in the body. There is no line for one.
- When the cause was upstream (Amazon, Snowflake), the `Cause` set phrase names
  the provider as fact and stops there. Don't editorialize, don't hide behind it.
- Never promise what we can't hold. "This will never happen again" is not
  publishable. Safeguards belong in the changelog, not here.

### Always give a next step

`Action` is never blank. If there is genuinely nothing to do, say so outright -
"No action needed, your history is complete" - rather than dropping the line.

### Be precise or the page is worthless

The entry has one job: letting someone answer "was I affected?" without writing
to support.

- Exact dates, exact dataset names. "Some data around the end of August" fails.
- Bound the scope when it's bounded: "only the BigQuery copy, Snowflake was
  correct", "only accounts tracking Walmart".
- Say whether a dataset was hit fully or partially, and name the regions when
  only some were affected ("US and Canada only", "a share of rows, not all").
  `Scope: All customers` when the dataset was only half hit sends every customer
  to support to find out whether that means them.
- Use the dataset names customers actually query, spelled exactly.

### Don't expose internal plumbing

Describe the effect, not our architecture. No internal job, service, repo,
pipeline, or tool names, no Slack channels, no vendor tooling. This is why the
`Cause` phrases are a fixed set: `[provider]` is the only blank, and it only ever
holds a name the customer already deals with.

The exception is customer-facing dataset and table names - always exact.

### Language

- Never write crawl, scrape, bot, spider, or harvest about public-data collection.
  Use collect, track, monitor. See `CLAUDE.md` Section 16 - this rule matters more
  here than anywhere, because incidents are usually *about* collection.
- American English. Straight quotes. No emoji. No exclamation marks.
- Hyphens only. No em dashes, no en dashes, anywhere in an entry.
- Past tense for what happened, present for where things stand. Active voice.

### Updating a published entry

Facts change: a backfill runs, an investigation concludes, an `in-progress`
incident closes. Add a dated line at the bottom of the body, below the `Update`
block, saying what changed:

```mdx
Update, Sep 20, 2026: the August 20 gap has been backfilled.
```

Don't silently rewrite history, and don't change `status` without one of these
lines explaining it. Multiple updates stack, oldest first.

Closing an `in-progress` entry is five edits to the same file, and no sixth:

1. `status` - to the resolved value that's actually true.
2. The header line - `Identified` becomes `Resolved`.
3. The `Update` block - `Cause` to past tense, `Progress: Resolved.`,
   `Historical data` to the outcome, `Action` to whatever is now true.
4. `updated` - the date of this revision, plus the dated update line in the body.
   `updated` moves the entry's RSS `pubDate`, so subscribers who already have the
   item see it again as resolved rather than keeping a stale "In progress" copy.
5. `severity`, if the outcome turned out worse than first published (permanent
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
| "A customer reported a sales spike on Sep 12." | `Issue type: Incorrect` |
| "We deeply apologize for this catastrophic data loss." | `Historical data: Some data for Aug 30 - Aug 31 could not be recovered; these gaps are permanent.` |
| "The EMS training job didn't trigger again." | `Cause: An internal processing issue affected updates.` |
| "Some data may have been affected around that period." | `Period: Aug 30 - Aug 31, 2026` |
| "This was entirely Amazon's fault." | `Cause: A confirmed issue with Amazon affected source data.` |
| "We are working hard to resolve this." | `Progress: We are working on a fix.` |
| "All customers may be affected." | `Scope: Snowflake destinations only, US and Canada marketplaces.` |

---

## 6. Worked examples

### Open entry

Intake said: FBA inventory stopped updating some time on Sep 18, Snowflake
customers, all marketplaces, not fixed, cause unknown, don't know yet whether the
missing days come back.

```mdx
---
title: "FBA inventory data is not updating"
description: "FBA inventory snapshots have not updated since September 18 for Snowflake destinations. We are working on a fix."
date: "2026-09-19"
dateRangeImpacted: "Since Sep 18, 2026"
datasetsImpacted: ["Raw Inventory (FBA)"]
status: "in-progress"
severity: "minor"
---

**Data update - Identified**

Issue type: Delayed
Period: Since Sep 18, 2026
Scope: Snowflake destinations, all marketplaces

Datasets:

- `INVENTORY.RAW_INVENTORY_FBA`

Update:

- Cause: We are investigating the cause.
- Progress: We are working on a fix.
- Historical data: We are assessing whether affected data can be recovered.
- Action: Treat FBA inventory from September 18 onward as incomplete until this entry says otherwise.
```

### Resolved entry

Intake said: order report double-counted during migration to the new collection
system. BigQuery share only, internal data fine. Sep 11-12, worst on the 12th.
Fixed Sep 14 around noon, figures corrected. Customer should re-pull. One
customer asked about it - don't name them.

```mdx
---
title: "Order data temporarily double-counted for two days"
description: "Some orders were counted twice on Sep 11 and 12, inflating sales figures in BigQuery Data Sharing until the fix landed Sep 14."
date: "2026-09-14"
dateRangeImpacted: "Sep 11 - Sep 12, 2026"
datasetsImpacted: ["Order and daily sales data (BigQuery Data Sharing)"]
status: "resolved-no-data-impact"
severity: "major"
---

**Data update - Resolved**

Issue type: Incorrect
Period: Sep 11 - Sep 12, 2026
Scope: BigQuery Data Sharing customers, all marketplaces. Snowflake was correct throughout.

Datasets:

- `MARKET.ORDERS`
- `MARKET.DAILY_SALES`

Update:

- Cause: An internal processing issue affected order updates.
- Progress: Resolved.
- Historical data: All affected data has been restored or corrected.
- Action: If you exported Sep 11 or Sep 12 before the fix, pull those dates again.
```

Note what the intake gave us and the entry doesn't: the customer, the internal
system name, and the fact that a customer found it rather than our monitoring.

Note also the severity: `major`, not `minor`, even though the data was fully
corrected. Wrong figures were live for three days, so customers read them and
acted on them. `status` still says nothing was lost - that's the split between
the two fields.

---

## 7. Before publishing

- [ ] All six required inputs settled, or the missing ones raised rather than guessed (section 2b)
- [ ] Frontmatter complete, `date` matches the filename prefix, `description` at most 160 characters
- [ ] `title` describes what happened and is not "Data update"
- [ ] Body follows section 2c exactly: header line, four facts lines, `Update` block, nothing else
- [ ] Header line matches `status`, and `Period` matches `dateRangeImpacted`
- [ ] `Issue type` matches the definitions in section 2c, and only one value is given
- [ ] `Scope` states partial and regional limits, and what was not affected
- [ ] `Datasets` names every dataset in `datasetsImpacted`, spelled as customers query it
- [ ] `Cause`, `Progress` and `Historical data` use the set phrases, with a specific sentence added when data is unrecoverable, and `Cause` omitted when severity is `low`
- [ ] `Action` is present and actionable, even if that's "No action needed"
- [ ] `status` is honest by section 3, and `Historical data` matches it
- [ ] `severity` is set by section 3b, and is the lower level when it was a close call
- [ ] Under about 120 words
- [ ] No customer, company, workspace ID, or employee name anywhere
- [ ] No internal system names, no crawl/scrape language, no emoji, no em dashes, American English
- [ ] Revising a published entry: filename and `date` untouched, `updated` set to today, dated update line added
- [ ] `node scripts/check-content-rules.mjs --all` reports no errors for the new file
- [ ] `pnpm dev`, then check `/incidents` - the entry appears in the list with the right badge, the banner at the top matches (all-clear, or naming this incident when it's `in-progress`), and `/incidents/feed.xml` includes it
- [ ] Someone on CS reads the wording before it merges

Publishing the entry is not the whole job. Post it in `#cs` too, so support knows
it exists before a customer asks.
