# First Down Scotland

A **learn the NFL** app for Scottish and UK beginners, with fixtures and a honest where-to-watch note on the side.

**Tagline:** Built in Scotland, for anyone in the UK getting into the NFL.

Learning is the hero. This is not a TV listings product.

## What v1 includes

- **`/`** — value prop, Start learning CTA, full lesson list, and a small “games this week” teaser
- **`/learn`** and **`/learn/[slug]`** — eight beginner lessons in UK English
- **`/glossary`** — searchable jargon decoder
- **`/this-week`** — this week’s NFL games from ESPN’s public scoreboard, times in `Europe/London`
- **`/watch`** — high-level UK viewing map (Sky / Channel 5 / 5Action / My5 / DAZN Game Pass / Netflix)
- **`/about`** — what the site is for
- PWA basics: web manifest, icons, mobile-first layout, `theme-color`

Out of scope: fantasy, live play-by-play UI, betting, accounts, push notifications, App Store builds, perfect per-game UK rights.

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

`npm run build` should succeed without any environment variables. The home and this-week pages fetch ESPN at build or request time and show a clear empty/error state if the feed is down.

## Environment variables

Copy `.env.example` if you want a local file. Nothing is required for day-to-day development.

| Name | Required | Purpose |
| --- | --- | --- |
| `CRON_SECRET` | Recommended in production | Protects `GET`/`POST` `/api/revalidate`. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. You can also pass `?secret=...`. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical / Open Graph base URL, e.g. `https://your-domain.vercel.app` |

If `CRON_SECRET` is unset, `/api/revalidate` is allowed only when `NODE_ENV` is not `production`.

## How fixtures refresh

Fixtures are **not** edited by hand.

1. The app calls ESPN’s public scoreboard:
   `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
2. If that response has no events, it retries with `year` / `seasontype` / `week` from the same payload.
3. Kick-off timestamps are converted to **Europe/London**.
4. Next.js caches the fetch for **300 seconds** and tags it `fixtures`.
5. `/` and `/this-week` also set `export const revalidate = 300`.

On Vercel, `vercel.json` schedules an hourly Cron (15 minutes past the hour) to `GET /api/revalidate`. That route runs:

- `revalidateTag('fixtures', 'max')`
- `revalidatePath('/')`
- `revalidatePath('/this-week')`

Set `CRON_SECRET` in the Vercel project so the Cron request is accepted. You can also hit the route yourself:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.vercel.app/api/revalidate
```

## Deploy on Vercel

1. Import the GitHub repo into [Vercel](https://vercel.com/new).
2. Framework preset: Next.js. Build command: `npm run build`.
3. Add `CRON_SECRET` (and optionally `NEXT_PUBLIC_SITE_URL`) under Project Settings → Environment Variables.
4. Deploy. Cron jobs from `vercel.json` are registered on Hobby+ / Pro according to your Vercel plan.

Hobby Cron is typically once per day; the 300-second ISR still keeps times and scores reasonably fresh between visits. On plans that honour hourly Cron, `/api/revalidate` warms the cache in the background.

## Information architecture

| Route | Role |
| --- | --- |
| `/` | Learning home + fixtures teaser |
| `/learn` | Lesson index |
| `/learn/what-youre-watching` … `/learn/what-to-look-for` | The eight lessons |
| `/glossary` | Jargon decoder |
| `/this-week` | Auto fixtures |
| `/watch` | UK viewing explainer |
| `/about` | Project purpose |

## Licence and attribution

Independent fan project. Not affiliated with the NFL, Sky, Channel 5, DAZN, Netflix or ESPN. Scoreboard data is read from ESPN’s public site API and may change without notice.
