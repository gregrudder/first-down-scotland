import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { NEWS_CACHE_TAG } from "@/data/news-feeds";
import { FIXTURES_CACHE_TAG } from "@/lib/espn";

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
  revalidateTag(NEWS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/this-week");
  revalidatePath("/news");

  return NextResponse.json({
    revalidated: true,
    tags: [FIXTURES_CACHE_TAG, NEWS_CACHE_TAG],
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
