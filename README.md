# First Down Scotland

A **learn the NFL** app for Scottish and UK beginners, with fixtures and a honest where-to-watch note on the side.

**Tagline:** Built in Scotland, for anyone in the UK getting into the NFL.

Learning is the hero. This is not a TV listings product.

## What v1 includes

- **`/`** — value prop, Start learning CTA, full lesson list, and a small “games this week” teaser
- **`/learn`** and **`/learn/[slug]`** — ten beginner lessons in UK English, including X-and-O play diagrams at `/learn/plays`. Stage progress bars and a 20-question quiz at `/learn/quiz` (saved in the browser as `fds-learn`). Badges: Practice Squad (0–7) → Rookie (8–12) → Starter (13–17) → Hall of Famer (18–20).
- **`/glossary`** — searchable jargon decoder
- **`/this-week`** — this week’s NFL games from ESPN’s public scoreboard, times in `Europe/London`
- **`/news`** — NFL headlines pulled automatically from public RSS (ESPN, BBC Sport, the Guardian)
- **`/news/fantasy`** — NFL fantasy football tips & news (not Scottish football)
- **`/podcasts`** — recommended NFL and per-team shows to follow (external links; official vs independent labelled)
- **`/watch`** — high-level UK viewing map (Sky / Channel 5 / 5Action / My5 / DAZN Game Pass / Netflix)
- **`/film-room`** — curated watch-to-learn films (America’s Game, Hard Knocks, All or Nothing, Quarterback, Wide Receiver). Official where-to-look hints only; no streams.
- **`/watch-near-you`** — Scottish pubs that show the NFL (free listings; demo featured card; more cities coming)
- **`/about`** — what the site is for
- **`/community`** — Discord for Scottish / UK fans (invite via env; no in-app chat)
- **`/history`** — short NFL history for UK beginners (timeline, not a thesis)
- **`/teams`** and **`/teams/[slug]`** — all 32 club profiles (2026-season snapshot), ESPN depth chart, official YouTube, and the relevant pods
- **`/pick-your-team`** — quiz or spinning-ball surprise to pick a team; saved in the browser as `fds-team`
- PWA basics: web manifest, icons, mobile-first layout, `theme-color`

Out of scope: live fantasy scoring / league apps, live play-by-play UI, betting, accounts, push notifications, App Store builds, perfect per-game UK rights.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- ESPN public scoreboard API (no keys)
- Vercel-ready ISR + optional Cron revalidation

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
| `NEXT_PUBLIC_DISCORD_INVITE` | Optional | If set to a valid discord.gg / discord.com invite, `/community` shows Join the Discord. If unset or invalid, the page shows Discord coming soon (no hardcoded invite). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Overrides the Watch near you “get in touch” mailto (defaults to `info@g4-marketing.net`). |

If `CRON_SECRET` is unset, `/api/revalidate` is allowed only when `NODE_ENV` is not `production`.

## How fixtures refresh

Fixtures are **not** edited by hand.

1. The app calls ESPN’s public scoreboard:
   `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
2. If that response has no events, it retries with `year` / `seasontype` / `week` from the same payload.
3. Kick-off timestamps are converted to **Europe/London**.
4. Next.js caches the fetch for **300 seconds** and tags it `fixtures`.
5. `/` and `/this-week` also set `export const revalidate = 300`.

On Vercel, `vercel.json` schedules a **daily** Cron at `0 6 * * *` (06:00 UTC) to `GET /api/revalidate`. That route runs:

- `revalidateTag('fixtures', 'max')`
- `revalidateTag('news', 'max')`
- `revalidateTag('news-fantasy', 'max')`
- `revalidatePath('/')`
- `revalidatePath('/this-week')`
- `revalidatePath('/news')`
- `revalidatePath('/news/fantasy')`

Hobby only allows **once-per-day** Cron. Pages still refresh without the Cron: the 300-second ISR / fetch revalidate keeps times and scores reasonably fresh between visits. On Pro you can change the expression to hourly (for example `15 * * * *`) if you want a background warm more often.

Team depth charts use the same ESPN public API family (`…/teams/{id}/depthcharts` plus roster names), cached for **600 seconds** and tagged `depth-charts`. The daily Cron busts that tag too. If ESPN is down, the profile still renders and we say so.

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
| `/learn/what-youre-watching` … `/learn/what-to-look-for` | The ten lessons |
| `/learn/plays` and `/learn/plays/[slug]` | Common play diagrams |
| `/learn/quiz` | 20-question path quiz + badges (`fds-learn`) |
| `/glossary` | Jargon decoder |
| `/this-week` | Auto fixtures |
| `/news` | Auto NFL headlines (RSS, link out) |
| `/news/fantasy` | Auto NFL fantasy headlines (RSS, link out) |
| `/watch` | UK viewing explainer |
| `/film-room` | Watch-to-learn films and series |
| `/watch-near-you` | Scottish NFL pubs (free listings + demo featured card) |
| `/community` | Discord community (invite CTA) |
| `/history` | Short NFL history timeline |
| `/teams` | All 32 teams by conference / division |
| `/teams/[slug]` | Club profile (stadium, colours, Super Bowls, live depth chart) |
| `/pick-your-team` | Quiz or spin to pick a team (saved as `fds-team`) |
| `/about` | Project purpose |

## Licence and attribution

Independent fan project. Not affiliated with the NFL, Sky, Channel 5, DAZN, Netflix, the BBC, the Guardian or ESPN. Scoreboard data is read from ESPN’s public site API and may change without notice. News headlines and snippets come from those publishers’ public RSS feeds and link back to the original articles.

Team profiles use ESPN’s public logo CDN (`https://a.espncdn.com/i/teamlogos/nfl/500/{abbr}.png`) with an abbreviation-circle fallback. Stadium names and listed capacities follow Wikipedia’s current NFL stadiums list for the **2026 season** (cited there to club media guides and reporting). Super Bowl counts are after Super Bowl LX (Seattle 29–13 New England, 8 February 2026; AP / NFL.com). Franchise origins follow the league’s published history and standard reference summaries. Stadium names, capacities and trophy counts can change.

`/watch-near-you` listings live in `src/data/pubs.ts`. Live rows were checked against the pubs’ own sites (Duke’s Leith, Malones Edinburgh / Glasgow, Ark Glasgow). Hours and what is on the screen change — the page says to call ahead. The Gridiron Arms card is a fictional demo.
