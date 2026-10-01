import type { Metadata } from "next";
import Link from "next/link";
import { NewsFeedList } from "@/components/NewsFeedList";
import { NewsTabs } from "@/components/NewsTabs";
import { PageIntro } from "@/components/PageIntro";
import { nflNewsFeeds } from "@/data/news-feeds";
import { thinPageRobots } from "@/lib/indexing";
import { getNflNews } from "@/lib/news";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "NFL wire headlines",
  description:
    "NFL headlines pulled from public RSS feeds (ESPN, BBC Sport and the Guardian) for Scottish and UK fans. We link out; we do not republish the articles.",
  robots: thinPageRobots,
};

export default async function NewsHeadlinesPage() {
  const news = await getNflNews();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Wire" title="NFL headlines">
        <p>
          Latest NFL headlines in one place, for fans in Scotland and the rest of
          the UK. You can find these stories on the original sites. We pull public
          RSS feeds, show a short card, and send you out. We do not copy whole
          articles.
        </p>
        <p>
          Our own notes are on{" "}
          <Link href="/news" className="text-gold">
            Our take
          </Link>
          .
        </p>
      </PageIntro>
      <NewsTabs active="nfl" />
      <NewsFeedList
        news={news}
        sourceLabels={nflNewsFeeds.map((feed) => feed.label)}
      />
    </div>
  );
}
