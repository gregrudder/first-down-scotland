import type { NewsArticle } from "@/lib/news";
import { getNflNews } from "@/lib/news";
import type { NflGame, TeamSide } from "@/lib/espn";
import {
  ESPN_SUMMARY_CACHE_TAG,
  ESPN_SUMMARY_REVALIDATE_SECONDS,
  fetchEspnSummaryJson,
} from "@/lib/espn-summary";
import { stripMarkup } from "@/lib/rss";

export const GAME_REPORTS_CACHE_TAG = ESPN_SUMMARY_CACHE_TAG;
export const GAME_REPORTS_REVALIDATE_SECONDS = ESPN_SUMMARY_REVALIDATE_SECONDS;

const SNIPPET_MAX = 280;

export type GameReportKind = "preview" | "recap";
export type GameReportState = "ready" | "pending";

export type GameReport = {
  gameId: string;
  kind: GameReportKind;
  state: GameReportState;
  headline: string;
  snippet: string;
  source: string;
  sourceUrl: string | null;
};

type EspnArticleBits = {
  type: string;
  headline: string;
  snippet: string;
  url: string | null;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function clipSnippet(value: string): string {
  const clean = stripMarkup(value);
  if (clean.length <= SNIPPET_MAX) return clean;
  const cut = clean.slice(0, SNIPPET_MAX - 1);
  const atSpace = cut.lastIndexOf(" ");
  return `${(atSpace > 120 ? cut.slice(0, atSpace) : cut).trimEnd()}…`;
}

function recordBit(team: TeamSide): string {
  return team.record ? ` (${team.record})` : "";
}

function scoreLine(game: NflGame): string {
  if (typeof game.home.score !== "number" || typeof game.away.score !== "number") {
    return "";
  }
  return ` It finished ${game.away.score}-${game.home.score}.`;
}

function fdsPreview(game: NflGame): { headline: string; snippet: string } {
  const away = `${game.away.shortName}${recordBit(game.away)}`;
  const home = `${game.home.shortName}${recordBit(game.home)}`;
  const place = game.venueCity ? ` in ${game.venueCity}` : "";
  return {
    headline: `${game.away.shortName} at ${game.home.shortName}`,
    snippet: `${away} visit ${home}${place}. For a beginner: watch who wins first down, then whether the quarterback has time. That’s enough until you know the names.`,
  };
}

function fdsRecapPending(game: NflGame): { headline: string; snippet: string } {
  return {
    headline: `${game.away.shortName} at ${game.home.shortName}: full time`,
    snippet: `${game.away.shortName} against ${game.home.shortName} is done.${scoreLine(game)} Report coming: a short summary will land here when ESPN or another feed publishes one.`,
  };
}

function mentionsTeam(haystack: string, team: TeamSide): boolean {
  const text = haystack.toLowerCase();
  if (text.includes(team.shortName.toLowerCase())) return true;
  if (text.includes(team.name.toLowerCase())) return true;
  const abbr = team.abbreviation.replace(/[^A-Za-z0-9]/g, "");
  if (abbr.length >= 2) {
    return new RegExp(`\\b${abbr}\\b`, "i").test(haystack);
  }
  return false;
}

function articleTouchesMatchup(article: NewsArticle, game: NflGame): boolean {
  const hay = `${article.title} ${article.snippet}`;
  return mentionsTeam(hay, game.home) && mentionsTeam(hay, game.away);
}

function titleLooksLike(article: NewsArticle, kind: GameReportKind): boolean {
  const title = article.title.toLowerCase();
  if (kind === "preview") {
    return /\bpreview\b|\bpreviewing\b|\bwhat to watch\b|\bkeys to\b/.test(title);
  }
  return /\brecap\b|\breport\b|\btakeaways\b|\bfull time\b|\bfinal\b/.test(title);
}

function pickNewsMatch(articles: NewsArticle[], game: NflGame, kind: GameReportKind): NewsArticle | null {
  const hits = articles.filter((article) => articleTouchesMatchup(article, game));
  if (hits.length === 0) return null;
  const preferred = hits.find((article) => titleLooksLike(article, kind));
  return preferred ?? hits[0] ?? null;
}

function reportFromNews(
  game: NflGame,
  article: NewsArticle,
  kind: GameReportKind,
): GameReport {
  return {
    gameId: game.id,
    kind,
    state: "ready",
    headline: article.title,
    snippet: article.snippet || fdsPreview(game).snippet,
    source: article.source,
    sourceUrl: article.url,
  };
}

function reportFromEspnArticle(
  game: NflGame,
  article: EspnArticleBits,
  kind: GameReportKind,
): GameReport {
  return {
    gameId: game.id,
    kind,
    state: "ready",
    headline: article.headline,
    snippet: article.snippet || (kind === "recap" ? fdsRecapPending(game).snippet : fdsPreview(game).snippet),
    source: "ESPN",
    sourceUrl: article.url ?? game.recapUrl ?? game.gamecastUrl ?? null,
  };
}

function parseEspnArticle(data: unknown): EspnArticleBits | null {
  if (!isRecord(data)) return null;
  const article = isRecord(data.article) ? data.article : null;
  if (!article) return null;
  const headline = asString(article.headline) ?? asString(article.title);
  if (!headline) return null;
  const type = (asString(article.type) ?? "Story").toLowerCase();
  const snippetSource =
    asString(article.description) ?? asString(article.caption) ?? "";
  const links = isRecord(article.links) ? article.links : {};
  const web = isRecord(links.web) ? links.web : {};
  const mobile = isRecord(links.mobile) ? links.mobile : {};
  const url = asString(web.href) ?? asString(mobile.href) ?? null;
  return {
    type,
    headline,
    snippet: snippetSource ? clipSnippet(snippetSource) : "",
    url,
  };
}

async function fetchEspnSummary(gameId: string): Promise<EspnArticleBits | null> {
  const data = await fetchEspnSummaryJson(gameId, {
    revalidate: ESPN_SUMMARY_REVALIDATE_SECONDS,
    tags: [ESPN_SUMMARY_CACHE_TAG],
  });
  return parseEspnArticle(data);
}

function buildReport(
  game: NflGame,
  articles: NewsArticle[],
  espnArticle: EspnArticleBits | null,
): GameReport {
  if (game.status === "in-progress") {
    return {
      gameId: game.id,
      kind: "recap",
      state: "pending",
      headline: `${game.away.shortName} at ${game.home.shortName}: live`,
      snippet:
        "This one is still going. A short post-match report will land here after full time.",
      source: "First Down Scotland",
      sourceUrl: game.gamecastUrl ?? null,
    };
  }

  if (game.status === "final") {
    if (espnArticle && espnArticle.headline && (espnArticle.snippet || espnArticle.url)) {
      return reportFromEspnArticle(game, espnArticle, "recap");
    }
    const newsRecap = pickNewsMatch(articles, game, "recap");
    if (newsRecap) return reportFromNews(game, newsRecap, "recap");

    const pending = fdsRecapPending(game);
    return {
      gameId: game.id,
      kind: "recap",
      state: "pending",
      headline: pending.headline,
      snippet: pending.snippet,
      source: "First Down Scotland",
      sourceUrl: game.recapUrl ?? game.gamecastUrl ?? null,
    };
  }

  if (espnArticle && espnArticle.type.includes("preview")) {
    return reportFromEspnArticle(game, espnArticle, "preview");
  }
  const newsPreview = pickNewsMatch(articles, game, "preview");
  if (newsPreview) return reportFromNews(game, newsPreview, "preview");

  const local = fdsPreview(game);
  return {
    gameId: game.id,
    kind: "preview",
    state: "ready",
    headline: local.headline,
    snippet: local.snippet,
    source: "First Down Scotland",
    sourceUrl: game.gamecastUrl ?? null,
  };
}

export async function getGameReports(
  games: NflGame[],
): Promise<Record<string, GameReport>> {
  if (games.length === 0) return {};

  const news = await getNflNews();
  const articles = news.ok ? news.articles : [];

  const wantSummary = games.filter((game) => game.status === "final");
  const summaries = await Promise.all(
    wantSummary.map(async (game) => {
      const article = await fetchEspnSummary(game.id);
      return [game.id, article] as const;
    }),
  );
  const byId = new Map(summaries);

  const reports: Record<string, GameReport> = {};
  for (const game of games) {
    reports[game.id] = buildReport(game, articles, byId.get(game.id) ?? null);
  }
  return reports;
}
