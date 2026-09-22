# Incident intake

Fill this in when something goes wrong with customer data. Paste it into a Slack
thread, or hand it straight to the agent that writes the docs entry.

You're writing notes, not prose. Internal words are fine here - the agent
translates them into customer language and strips anything that shouldn't go
public. Write "not sure" where you're not sure. A gap is easy to chase; a
confident guess that turns out wrong is what we end up apologizing for twice.

Questions 2, 3, 4, 5 and 5b are the ones an entry can't be written without. Leave
any of them blank and the agent will come back asking rather than guess.

---

## First: does this need a public entry?

Publish when **any** of these is true:

- Customer-visible data was missing, wrong, or late for a full day or more.
- Any data could not be recovered, however narrow the window.
- A customer asked about it, or support sent an explanation.
- Access to a delivery surface (Snowflake, BigQuery, the app) broke for more than a few hours.

Skip it when the problem never reached customer-facing data - a failed job that
retried successfully, a staging issue, an internal alert we cleared before the
next pipeline run. Those belong in engineering channels, not the docs.

When you can't decide, write the entry. An entry nobody needed costs us a few
minutes. A missing entry costs us the "why did I have to find this out myself"
conversation.

---

## The form

**1. In one line, what went wrong?**
>

**2. Which datasets or tables were affected?**
Exact names where you have them (`MARKET.PRODUCT_SALES_RANK`), plus a plain-English
name if the table name is cryptic. Also say:
- Was the whole dataset hit, or only part of it (some rows, some ASINs)?
- All marketplaces, or only certain regions?
>

**3. Which data dates are affected?**
The dates of the *data*, not the day you noticed. If the data for Sep 11 was wrong
but you found it on Sep 14, the answer is Sep 11.
>

**4. Key dates**
Detection and resolution are the two we can't write the entry without. "Started"
is useful but optional.
> Detected (when we spotted it):
> Resolved (when it was fixed):
> Started (if known):

**5. Where does it stand?** Pick one:
- [ ] **Still open** - not fixed yet. Say so; we can publish now and update later.
      This also puts a notice at the top of the incidents page for as long as it
      stays open, so tell us when it resolves - that's what takes the notice down.
- [ ] **Fixed, no data impact** - recovered, corrected, or it never touched the data
- [ ] **Fixed, some data permanently lost** - cannot be reconstructed

If it's partial, say exactly which part is lost and which part came back. If a
backfill is planned but hasn't run, it still counts as lost until it does.
>

**5b. How severe was it?** Pick one:
- [ ] **Low** - one dataset, short window, few customers, nothing to do
- [ ] **Minor** - real impact, now resolved (delayed and caught up, wrong then corrected, access restored)
- [ ] **Major** - data permanently lost, or wide enough that customers have to act

If anything was permanently lost, it's major - that one isn't a judgment call.
Otherwise, if you're not sure, say which two you're between and why; the lower
one usually wins.
>

**6. What caused it?**
Internal words are fine - the agent translates them.
- **Required** if any data was permanently lost, however fast we fixed it.
- **Not needed** if this is a low-severity notice.
- Otherwise optional when it was resolved within 48 hours; required if it ran
  longer or could recur.
>

**7. What did we do to fix it?**
>

**8. What stops it happening again?**
A safeguard we actually shipped, or a change we've committed to. If the answer is
"nothing yet", say that - we just won't publish a promise.
>

**9. What should an affected customer do?**
Re-run a query? Ignore those dates? Expect a backfill? Nothing at all? Every entry
has to end with something actionable, so this one can't be blank.
>

**10. Who was affected?**
All customers, or only those using a specific dataset, destination, or marketplace?
>

**11. Has anyone been told already?**
Support replies, emails, Slack messages to a customer. Paste what was said so the
public entry doesn't contradict it.
>

**12. Anything we must NOT publish?**
Contract details, security specifics, a customer's identity, anything still
under investigation.
>

---

## Filled example

> **1. What went wrong:** Order report got counted twice during the migration to the new
> collection system, so shared sales numbers were inflated.
> **2. Datasets:** order + daily sales data in the BigQuery share, all marketplaces, partial (only duplicated orders). Internal tables were fine.
> **3. Data dates:** Sep 11 and Sep 12, worst on the 12th.
> **4. Dates:** detected Sep 14 morning, resolved Sep 14 around noon, started Sep 11 with the migration.
> **5. Status:** fixed, no data impact - values were wrong, now corrected.
> **5b. Severity:** minor - two days of wrong numbers, one destination, fixed same day.
> **6. Cause:** overlapping window in the sharing incremental during migration, double-counted some orders.
> **7. Fix:** re-ran the share, corrected figures live within ~20 min.
> **8. Prevention:** added safeguards on the incremental so overlap can't double-count.
> **9. Customer action:** if you pulled Sep 11-12 sales before the fix, pull again - the numbers are correct now.
> **10. Who:** BigQuery Data Sharing customers only. Snowflake was unaffected.
> **11. Already told:** one customer got an explanation in a support thread - see wording there.
> **12. Don't publish:** the customer's name or their workspace ID.

That intake produced `content/incidents/2026-09-14-order-sales-double-counting.mdx`.
