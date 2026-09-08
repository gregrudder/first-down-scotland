import type { Metadata } from "next";
import { NewsFeedList } from "@/components/NewsFeedList";
import { NewsTabs } from "@/components/NewsTabs";
import { PageIntro } from "@/components/PageIntro";
import { nflNewsFeeds } from "@/data/news-feeds";
import { getNflNews } from "@/lib/news";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "NFL news",
  description:
    "What’s going on in the NFL: headlines pulled automatically from ESPN, BBC Sport and the Guardian. We link out; we do not republish the articles.",
};

export default async function NewsPage() {
  const news = await getNflNews();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Headlines" title="What’s going on in the NFL">
        <p>
          A beginner-friendly pile of recent headlines. We pull public RSS feeds : 
          you read the full piece on the original site. Nothing here is typed in by
          hand, and we do not copy whole articles.
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
