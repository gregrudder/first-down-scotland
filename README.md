# First Down Scotland

A **learning hub** for Scottish and UK NFL beginners, a **community to meet fans of the team you support**, and a **one-stop shop for that club** (news, fantasy, podcasts, depth, watch). Discord is the chat home. The pub list is for real-world meetups with people who picked the same side.

**Tagline:** Learn the NFL. Meet fans of your team. Follow that club in one place. Built in Scotland, for the UK.

Three jobs: learn the game, meet fans of your team, keep that club in one place. This is not a TV listings product or a magazine clone.

## What v1 includes

- **`/`** : value prop (learn, meet your team, follow that club in one place), Start learning + Meet your team CTAs, beginner lessons, Sunday card, and a small games teaser
- **`/learn`** and **`/learn/[slug]`** : beginner lessons in UK English, including X-and-O play diagrams at `/learn/plays` and a Draft explainer at `/learn/the-draft`. Stage progress bars and a 20-question quiz at `/learn/quiz` (saved in the browser as `fds-learn`). Badges: Practice Squad (0–7) → Rookie (8–12) → Starter (13–17) → Hall of Famer (18–20).
- **`/learn/draft-prospects`** : top 2027 Draft names (ESPN when the official list fills; otherwise a cited early consensus board), cached 600s, Cron-busted
- **`/glossary`** : searchable jargon decoder
- **`/this-week`** : this week’s NFL games from ESPN’s public scoreboard, times in `Europe/London`, plus a **Your Sunday** card for the team saved in the browser (`fds-team`). Each fixture has a short beginner preview or a post-match report (score + snippet + outbound link; “report coming” until a feed publishes one). Fair-use summaries only. Also UK kick-off, what to watch for, a Learn tie-in, optional ESPN QB snapshot, and a Scottish pub meetup hint. The full slate stays free. Tabs also lead to live scores, standings, and Rookie Watch.
- **`/scores`** : near-live scoreboard for the current week (Scheduled / Live / Final / Bye). Server fetch is uncached against ESPN; the `/api/scores` response is CDN-cached for **20 seconds**. The page polls that API every 20s while a game is on, 30s near kick-off, and 2 minutes midweek.
- **`/standings`** : AFC / NFC by division, with wins-losses-ties, points for/against, and division rank. ESPN public standings (`type=0&level=3`), cached **300 seconds**.
- **`/rookies`** : Rookie Watch for **this season’s drafted class** (the live scoreboard year; in 2026 that is the 2026 draft, not the 2025 class and not the 2027 college board). ESPN draft list plus Sleeper regular-season stats when any counting numbers exist. Cached **600 seconds**. Filter by team, position, or round.
- **`/news`** : NFL headlines pulled automatically from public RSS (ESPN, BBC Sport, the Guardian). Helper, not the product.
- **`/news/fantasy`** : NFL fantasy football tips & news (not Scottish football)
- **`/podcasts`** : UK/Scottish, general league, and per-team shows to follow (external links; official vs independent labelled)
- **`/watch`** : high-level UK viewing map (Sky / Channel 5 / 5Action / My5 / DAZN Game Pass / Netflix)
- **`/film-room`** : curated watch-to-learn films (America’s Game, Hard Knocks, All or Nothing, Quarterback, Wide Receiver). Official where-to-look hints only; no streams.
- **`/watch-near-you`** : Scottish pubs that show the NFL, framed as places to meet fans of the same team and arrange meetups. Free listings; demo featured card; more cities coming. Always call ahead.
- **`/about`** : what the site is for (learn + meet your team)
- **`/community`** : Discord as the chat home for Scottish / UK fans of the team you picked (Join the Discord CTA; default invite in the repo; override with `NEXT_PUBLIC_DISCORD_INVITE`; no in-app chat)
- **`/feedback`** : short tester form (posts to `/api/feedback`; Resend or Formspree). Inbox address is an env var, not in the repo.
- **`/history`** : short NFL history for UK beginners (timeline, not a thesis)
- **`/teams`** and **`/teams/[slug]`** : all 32 club profiles (2026-season snapshot), ESPN depth chart, official YouTube, and the relevant pods
- **`/pick-your-team`** : quiz or spinning-ball surprise to pick a team (so you can find other fans of that club); saved in the browser as `fds-team`
- PWA basics: web manifest, icons, mobile-first layout, `theme-color`

Out of scope: live fantasy scoring / league apps, live play-by-play UI, betting, accounts, push notifications, App Store builds, perfect per-game UK rights. The live scoreboard is scores and clock only.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- ESPN public scoreboard API (no keys)
- Vercel-ready ISR + optional Cron revalidation
- Vercel Web Analytics + Speed Insights (`@vercel/analytics`, `@vercel/speed-insights` in the root layout). **Turn on Analytics (and Speed Insights) in the Vercel project dashboard** if they are not already enabled; the packages do not collect in local `next dev`.

## Run locally

You need Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

`npm run build` should succeed without any environment variables. The home and this-week pages fetch ESPN at build or request time, and `/news` plus `/news/fantasy` fetch public RSS feeds. Each shows a clear empty/error state if a feed is down.

## Environment variables

Copy `.env.example` if you want a local file. Nothing is required for day-to-day development.

| Name | Required | Purpose |
| --- | --- | --- |
| `CRON_SECRET` | Recommended in production | Protects `GET`/`POST` `/api/revalidate`. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. You can also pass `?secret=...`. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical / Open Graph / sitemap base URL. If unset, we use `VERCEL_PROJECT_PRODUCTION_URL` or `https://first-down-scotland.vercel.app` — never a preview `*.vercel.app` host (those hit SSO). |
| `NEXT_PUBLIC_DISCORD_INVITE` | Optional | Override the Community join link. If unset or invalid, the app uses the public First Down Scotland invite (`https://discord.gg/dVuNUT4Cgf`). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Overrides the Watch near you “get in touch” mailto (defaults to `info@g4-marketing.net`). |
| `FORMSPREE_FORM_ID` | For `/feedback` on Hobby | Server-only Formspree form hash, or the full `https://formspree.io/f/…` URL. Inbox is set in the Formspree dashboard, not in this repo. |
| `RESEND_API_KEY` | For `/feedback` (option B) | Server-only. Sends via [Resend](https://resend.com). Needs a verified sending domain to reach an arbitrary inbox. |
| `FEEDBACK_TO_EMAIL` | With Resend | Server-only inbox. Never `NEXT_PUBLIC_*`. |
| `FEEDBACK_FROM_EMAIL` | Optional with Resend | Must be on a domain you verified in Resend. If unset, Resend’s `onboarding@resend.dev` sender is used (test mode: only the Resend account email can receive). |

Locally, if neither Formspree nor Resend is set, `/api/feedback` logs the note and returns success so the form can be tried. In production it returns **503** (“feedback inbox is not wired up”) until one option is configured. Provider failures return **502**. If Resend is set and fails, Formspree is tried next when `FORMSPREE_FORM_ID` is also set.

### Feedback on Vercel Hobby (Formspree)

Use Formspree. Resend on the free / onboarding sender cannot deliver to an iCloud (or any) address unless that address is the Resend login, or you verify a custom domain.

1. Create a free account at [formspree.io](https://formspree.io).
2. New form. Set the notification email in the Formspree dashboard to the inbox that should receive tester notes (do not put that address in Vercel as `NEXT_PUBLIC_*`, and do not commit it to the repo).
3. Copy the form endpoint. It looks like `https://formspree.io/f/xxxxxxxx`. The id is the last segment; pasting the whole URL also works.
4. Confirm the Formspree account / form email if they send a confirmation (check spam).
5. In Vercel: the project → **Settings** → **Environment Variables**.
   - Name: `FORMSPREE_FORM_ID`
   - Value: the id or the full URL
   - Environment: **Production** (add Preview if you want PR deploys to send too)
   - Leave **Sensitive** on. Do not tick “Automatically expose to the browser”.
6. **Redeploy** Production. New env vars do not apply to the deployment that is already live: Deployments → the current Production deploy → Redeploy, or push a new commit.
7. Open `/feedback`, submit once, and check the Formspree inbox. The first live submission may need you to activate the form in Formspree.

Do not set `RESEND_API_KEY` unless you also have `FEEDBACK_FROM_EMAIL` on a verified domain. A Resend key plus the default onboarding sender is a common way to get a 502 with nothing in the inbox.

If `CRON_SECRET` is unset, `/api/revalidate` is allowed only when `NODE_ENV` is not `production`.

## How fixtures refresh

Fixtures are **not** edited by hand.

1. The app calls ESPN’s public scoreboard:
   `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
2. If that response has no events, it retries with `year` / `seasontype` / `week` from the same payload.
3. Kick-off timestamps are converted to **Europe/London**.
4. Next.js caches the fetch for **300 seconds** and tags it `fixtures`.
5. `/` and `/this-week` also set `export const revalidate = 300`.
6. `/scores` uses a **separate, uncached** ESPN scoreboard fetch so a 5-minute fixtures cache cannot stall the live board. The page and `/api/scores` set `revalidate = 20`. The browser polls `/api/scores` (Cache-Control `s-maxage=20`) every 20 seconds while any game is in progress.

## How standings refresh

1. The app calls ESPN’s public standings API, grouped by conference and division:
   `https://site.api.espn.com/apis/v2/sports/football/nfl/standings?type=0&level=3`
2. We show wins, losses, ties, points for / against, and a division rank we derive from win percentage (then wins, then point difference).
3. Next.js caches the fetch for **300 seconds** and tags it `standings`. `/standings` sets `export const revalidate = 300`.
4. Club profiles (`/teams/[slug]`) reuse the same payload for that club’s division table.

## How Rookie Watch refreshes

1. Season year comes from the live ESPN scoreboard (today: **2026** regular season, Week 1). The draft class is that same year: **2026 NFL Draft**, not 2025 (those players are year two) and not the 2027 college prospects board.
2. ESPN’s public draft list:
   `https://site.api.espn.com/apis/site/v2/sports/football/nfl/draft?year={seasonYear}`
3. Season counting stats come from Sleeper’s public regular-season dump:
   `https://api.sleeper.app/v1/stats/nfl/regular/{seasonYear}`
   Player IDs are matched via `https://api.sleeper.app/v1/players/nfl` **only after** that stats dump has real counting numbers. Before Week 1 we skip that large file and say stats are not available yet.
4. Next.js caches draft/stats for **600 seconds** (`rookies` tag). The Sleeper players map uses **86400 seconds**. `/rookies` sets `export const revalidate = 600`.
5. If a match or a stat is missing, the card says so. We do not invent numbers. Offensive line and long-snapper cards explain that box-score stats are not listed.

On Vercel, `vercel.json` schedules a **daily** Cron at `0 6 * * *` (06:00 UTC) to `GET /api/revalidate`. That route runs:

- `revalidateTag('fixtures', 'max')`
- `revalidateTag('scores', 'max')`
- `revalidateTag('standings', 'max')`
- `revalidateTag('rookies', 'max')`
- `revalidateTag('news', 'max')`
- `revalidateTag('news-fantasy', 'max')`
- `revalidateTag('depth-charts', 'max')`
- `revalidateTag('draft-prospects', 'max')`
- `revalidatePath('/')`
- `revalidatePath('/this-week')`
- `revalidatePath('/scores')`
- `revalidatePath('/standings')`
- `revalidatePath('/rookies')`
- `revalidatePath('/news')`
- `revalidatePath('/news/fantasy')`
- `revalidatePath('/teams')`
- `revalidatePath('/learn')`
- `revalidatePath('/learn/draft-prospects')`

Hobby only allows **once-per-day** Cron. Pages still refresh without the Cron: the 300-second ISR / fetch revalidate keeps times and standings reasonably fresh between visits, and `/scores` polls every 20 seconds while games are on. On Pro you can change the expression to hourly (for example `15 * * * *`) if you want a background warm more often. No new environment variables are required for standings, scores, or Rookie Watch.

Team depth charts use the same ESPN public API family (`…/teams/{id}/depthcharts` plus roster names), cached for **600 seconds** and tagged `depth-charts`. The daily Cron busts that tag too. If ESPN is down, the profile still renders and we say so.

## How 2027 draft prospects refresh

The top-12 board is **not** a hand-edited mock.

1. The app tries ESPN’s public 2027 draft athlete list:
   `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2027/draft/athletes`
2. That list is empty until ESPN publishes the class. Until then we show a cited early consensus (The Athletic, Yahoo Sports, Sporting News) of names that sit on at least two of those boards.
3. Next.js caches the fetch for **600 seconds** and tags it `draft-prospects`. `/learn/draft-prospects` and `/learn` also set `export const revalidate = 600`.
4. The daily Hobby Cron busts the tag and `/learn/draft-prospects`.

Rankings move. The page says so. This is not a betting slip.

## How NFL news refreshes

Headlines are **not** pasted in by hand.

1. `/news` fetches three public RSS feeds in parallel:
   - ESPN NFL — `https://www.espn.com/espn/rss/nfl/news`
   - BBC Sport American football — `https://feeds.bbci.co.uk/sport/american-football/rss.xml`
   - The Guardian NFL — `https://www.theguardian.com/sport/nfl/rss`
2. We show headline, source, Europe/London time, and a short snippet from the feed, then **link out**. Full articles stay on the publisher’s site.
3. Items are deduped by normalised URL (tracking query params stripped) and by title.
4. Next.js caches each feed fetch for **600 seconds** (10 minutes) and tags it `news`. `/news` also sets `export const revalidate = 600`.
5. The daily Hobby Cron also busts the `news` tag. Do **not** add an hourly Cron on Hobby — ISR is the ongoing refresh.

If a feed fails, the others still show. If all fail, the page says so instead of inventing headlines.

`/news/fantasy` uses the same pattern with its own tag (`news-fantasy`) and these feeds:

- ESPN Fantasy — `https://www.espn.com/espn/rss/fantasy/news` (we keep NFL / fantasy-football items and drop baseball and other sports)
- Fantasy Footballers — `https://www.thefantasyfootballers.com/feed/`
- RotoWire NFL player news — `https://www.rotowire.com/rss/news.php?sport=NFL`

The News nav stays one item; NFL and Fantasy are tabs on the news pages. This is **NFL fantasy**, not Scottish football.

Set `CRON_SECRET` in the Vercel project so the Cron request is accepted. You can also hit the route yourself:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.vercel.app/api/revalidate
```

## Deploy on Vercel

1. Import the GitHub repo into [Vercel](https://vercel.com/new).
2. Framework preset: Next.js. Build command: `npm run build`.
3. Add `CRON_SECRET` (and optionally `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DISCORD_INVITE`, and `NEXT_PUBLIC_CONTACT_EMAIL`) under Project Settings → Environment Variables.
4. Deploy. Cron jobs from `vercel.json` are registered on Hobby / Pro according to your Vercel plan.

## Information architecture

| Route | Role |
| --- | --- |
| `/` | Learning home + fixtures teaser |
| `/learn` | Lesson index, stage progress bars |
| `/learn/draft-prospects` | Top 2027 draft prospects (cached) |
| `/learn/what-youre-watching` … `/learn/the-draft` | The lessons, including the Draft |
| `/learn/plays` and `/learn/plays/[slug]` | Common play diagrams |
| `/learn/quiz` | 20-question path quiz + badges (`fds-learn`) |
| `/glossary` | Jargon decoder |
| `/this-week` | Auto fixtures |
| `/scores` | Near-live scoreboard (20s poll while live) |
| `/standings` | AFC / NFC by division |
| `/rookies` | This season’s drafted rookies + stats |
| `/news` | Auto NFL headlines (RSS, link out) |
| `/news/fantasy` | Auto NFL fantasy headlines (RSS, link out) |
| `/watch` | UK viewing explainer |
| `/film-room` | Watch-to-learn films and series |
| `/watch-near-you` | Scottish NFL pubs (free listings + demo featured card) |
| `/community` | Discord community (invite CTA) |
| `/feedback` | TikTok-test feedback form |
| `/history` | Short NFL history timeline |
| `/teams` | All 32 teams by conference / division |
| `/teams/[slug]` | Club profile (stadium, colours, Super Bowls, live depth chart) |
| `/pick-your-team` | Quiz or spin to pick a team (saved as `fds-team`) |
| `/about` | Project purpose |

## Licence and attribution

Independent fan project. Not affiliated with the NFL, Sky, Channel 5, DAZN, Netflix, the BBC, the Guardian or ESPN. Scoreboard data is read from ESPN’s public site API and may change without notice. News headlines and snippets come from those publishers’ public RSS feeds and link back to the original articles.

Team profiles use ESPN’s public logo CDN (`https://a.espncdn.com/i/teamlogos/nfl/500/{abbr}.png`) with an abbreviation-circle fallback. Stadium names and listed capacities follow Wikipedia’s current NFL stadiums list for the **2026 season** (cited there to club media guides and reporting). Super Bowl counts are after Super Bowl LX (Seattle 29–13 New England, 8 February 2026; AP / NFL.com). Franchise origins follow the league’s published history and standard reference summaries. Stadium names, capacities and trophy counts can change.

`/watch-near-you` listings live in `src/data/pubs.ts`. Live rows were checked against the pubs’ own sites (Duke’s Leith, Malones Edinburgh / Glasgow, Ark Glasgow). Hours and what is on the screen change — the page says to call ahead. The Gridiron Arms card is a fictional demo.
