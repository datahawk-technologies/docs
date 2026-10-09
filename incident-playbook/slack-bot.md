# Incident Slack bot

Posts new incidents and status changes to customers' Slack Connect channels.
It complements the RSS feed (`/incidents/feed.xml`), which serves customers who
follow incidents in their own Slack workspace or feed reader.

**Rollout status (Oct 9, 2026):** built and tested in a private test channel.
Kept on the `incident-slack-bot` branch while the RSS changes are tested. It
does nothing until this branch is merged into `main`.

## How it works

1. You push a change in `content/incidents/` to `main`.
2. GitHub Actions runs `.github/workflows/incident-notify.yml`.
3. `scripts/notify-incidents.mjs` compares the push with the previous commit:
   - new incident file: posts a **New incident** message (full details)
   - `status` changed: posts a **Status update** message (title, description, link)
   - anything else: posts nothing
4. It waits until the incident page is live (up to 15 minutes), then posts to
   every channel the bot is a member of.

It reads the MDX frontmatter, not the RSS feed. Both read the same files.

## Rules for authors

- Close or update an incident by editing the same MDX. A second MDX posts as a
  second "New incident".
- Never rename a published incident file.
- Update `description` when the status changes: it's the only text a status
  update shows.
- Don't test on real incidents. A status change on `main` reaches every
  customer channel. Use the dry run or the test channel (below).

## Files

| File | Role |
|---|---|
| `scripts/notify-incidents.mjs` | Detects changes, builds and sends the Slack message |
| `.github/workflows/incident-notify.yml` | Runs the script on pushes to `main` touching `content/incidents/` |
| `incident-playbook/slack-bot.md` | This page |

Status emoji and labels are defined twice, in the script and in
`app/incidents/feed.xml/route.ts`. Change both together.

## Setup (one time)

### 1. Slack app

Already created: **DataHawk Incidents** (api.slack.com/apps). To recreate it:
Create New App > From a manifest > YAML:

```yaml
display_information:
  name: DataHawk Incidents
  description: Posts DataHawk data incident updates from docs.datahawk.co/incidents
  background_color: "#0568d5"
features:
  bot_user:
    display_name: DataHawk Incidents
    always_online: false
oauth_config:
  scopes:
    bot:
      - chat:write
      - channels:read
      - groups:read
settings:
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

Then Install App > Install to Workspace, and copy the **Bot User OAuth Token**
(`xoxb-...`). Keep `token_rotation_enabled: false`, or the token expires after
12 hours and the job stops posting.

App icon: a 1024 x 1024 PNG of `public/logo.svg` on white (Slack doesn't accept SVG).

### 2. GitHub secret

Repo > Settings > Secrets and variables > Actions > New repository secret:
`SLACK_BOT_TOKEN` = the `xoxb-` token. Never commit the token.

### 3. Local token (for testing only)

Add `SLACK_BOT_TOKEN=xoxb-...` to `.env.local` (gitignored).

## Testing

Preview a message, sends nothing, no token needed:

```bash
node scripts/notify-incidents.mjs --file content/incidents/<file>.mdx --dry-run
```

Post one incident to one channel only:

```bash
node --env-file=.env.local scripts/notify-incidents.mjs --file content/incidents/<file>.mdx --channel <CHANNEL_ID>
```

Replay a real past status change (Sep 22 FBA incident closing) to one channel:

```bash
node --env-file=.env.local scripts/notify-incidents.mjs --before 46bbaf5~1 --after 46bbaf5 --channel <CHANNEL_ID>
```

Add `--no-wait` if the incident page isn't published yet. Test channel used so
far: `C04FVEH9J49`. Find a channel ID by clicking the channel name; it's at the
bottom of the panel.

## Going live

1. Merge `incident-slack-bot` into `main` and check `SLACK_BOT_TOKEN` is set.
2. Keep the bot only in the test channel for the first real incident push.
   Check the run under the repo's Actions tab.
3. Invite the bot to customer channels: `/invite @DataHawk Incidents`.
4. In any channel that gets the bot, remove the Slack RSS app subscription,
   or customers get every incident twice.

## Adding or removing a customer

Invite or remove the bot in their Slack Connect channel. There is no channel
list to maintain, on purpose: this repo is public, and a list would name
customers.

## Troubleshooting

| Message | Fix |
|---|---|
| `SLACK_BOT_TOKEN is not set` | Add the GitHub secret, or the line in `.env.local` |
| `invalid_auth` | Wrong or truncated token. Copy it again from OAuth & Permissions |
| `not_in_channel` | `/invite @DataHawk Incidents` in that channel |
| Nothing posts to one customer | Their Slack admin may block outside apps in shared channels |
| `Page never went live` | The site deploy failed or took over 15 minutes. Re-run the job |
