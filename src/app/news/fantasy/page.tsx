import type { Metadata } from "next";
import Link from "next/link";
import { NewsFeedList } from "@/components/NewsFeedList";
import { NewsTabs } from "@/components/NewsTabs";
import { PageIntro } from "@/components/PageIntro";
import { fantasyNewsFeeds } from "@/data/news-feeds";
import { getFantasyNews } from "@/lib/news";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "NFL fantasy news",
  description:
    "NFL fantasy football tips and news (not Scottish football), in one place with the rest of your team follow. Headlines from ESPN Fantasy, Fantasy Footballers and RotoWire, with links out.",
};

export default async function FantasyNewsPage() {
  const news = await getFantasyNews();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="NFL fantasy (not Scottish football)" title="Fantasy football tips & news">
        <p>
          This is <strong className="font-semibold text-cream">NFL fantasy</strong>:
          the American-football kind where you pick players, not Saturday 3pm in the
          SPFL. Part of following your team in one place: we pull public feeds,
          show a short card, and send you to the original site. New to it? There is
          a beginner lesson that explains formats, scoring, and the apps people use.
        </p>
        <p className="mt-3">
          <Link href="/learn/fantasy-football" className="text-gold">
            Fantasy football lesson →
          </Link>
        </p>
      </PageIntro>
      <NewsTabs active="fantasy" />
      <NewsFeedList
        news={news}
        sourceLabels={fantasyNewsFeeds.map((feed) => feed.label)}
      />
    </div>
  );
}
