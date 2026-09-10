import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { FANTASY_NEWS_CACHE_TAG, NEWS_CACHE_TAG } from "@/data/news-feeds";
import { DEPTH_CHART_CACHE_TAG } from "@/lib/depth-chart";
import { DRAFT_PROSPECTS_CACHE_TAG } from "@/lib/draft-prospects";
import { FIXTURES_CACHE_TAG, SCORES_CACHE_TAG } from "@/lib/espn";
import { GAME_REPORTS_CACHE_TAG } from "@/lib/game-report";
import { HIGHLIGHTS_CACHE_TAG } from "@/lib/highlights";
import { ROOKIES_CACHE_TAG } from "@/lib/rookies";
import { STANDINGS_CACHE_TAG } from "@/lib/standings";

function isAuthorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const header = request.headers.get("authorization");
  const query = request.nextUrl.searchParams.get("secret");
  return header === `Bearer ${secret}` || query === secret;
}

async function revalidateFixtures() {
  revalidateTag(FIXTURES_CACHE_TAG, "max");
  revalidateTag(SCORES_CACHE_TAG, "max");
  revalidateTag(STANDINGS_CACHE_TAG, "max");
  revalidateTag(ROOKIES_CACHE_TAG, "max");
  revalidateTag(NEWS_CACHE_TAG, "max");
  revalidateTag(FANTASY_NEWS_CACHE_TAG, "max");
  revalidateTag(DEPTH_CHART_CACHE_TAG, "max");
  revalidateTag(DRAFT_PROSPECTS_CACHE_TAG, "max");
  revalidateTag(GAME_REPORTS_CACHE_TAG, "max");
  revalidateTag(HIGHLIGHTS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/this-week");
  revalidatePath("/scores");
  revalidatePath("/score-history");
  revalidatePath("/standings");
  revalidatePath("/rookies");
  revalidatePath("/news");
  revalidatePath("/news/fantasy");
  revalidatePath("/teams");
  revalidatePath("/learn");
  revalidatePath("/learn/draft-prospects");

  return NextResponse.json({
    revalidated: true,
    tags: [
      FIXTURES_CACHE_TAG,
      SCORES_CACHE_TAG,
      STANDINGS_CACHE_TAG,
      ROOKIES_CACHE_TAG,
      NEWS_CACHE_TAG,
      FANTASY_NEWS_CACHE_TAG,
      DEPTH_CHART_CACHE_TAG,
      DRAFT_PROSPECTS_CACHE_TAG,
      GAME_REPORTS_CACHE_TAG,
      HIGHLIGHTS_CACHE_TAG,
    ],
    at: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  return revalidateFixtures();
}

export async function POST(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  return revalidateFixtures();
}
