import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { PageIntro } from "@/components/PageIntro";
import { nflNewsFeeds } from "@/data/news-feeds";
import { getNflNews } from "@/lib/news";
import { formatFetchedAt } from "@/lib/time";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "NFL news",
  description:
    "What’s going on in the NFL — headlines pulled automatically from ESPN, BBC Sport and the Guardian. We link out; we do not republish the articles.",
};

export default async function NewsPage() {
  const news = await getNflNews();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Headlines" title="What’s going on in the NFL">
        <p>
          A beginner-friendly pile of recent headlines. We pull public RSS feeds —
          you read the full piece on the original site. Nothing here is typed in by
          hand, and we do not copy whole articles.
        </p>
      </PageIntro>

      {!news.ok ? (
        <div className="mt-10 rounded-2xl border border-live/40 bg-navy-2 p-6">
          <h2 className="font-display text-2xl text-cream">The feeds are quiet</h2>
          <p className="mt-3 text-sm leading-6 text-cream-dim">{news.error}</p>
          <p className="mt-3 text-xs text-cream-dim">
            Last attempt {formatFetchedAt(news.fetchedAt)}. You can still{" "}
            <Link href="/learn" className="text-gold">
              keep learning
            </Link>{" "}
            or check{" "}
            <Link href="/this-week" className="text-gold">
              this week’s games
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <p className="mt-8 text-xs text-cream-dim">
            Refreshed {formatFetchedAt(news.fetchedAt)} · times in Europe/London
          </p>
          {news.failedSources.length > 0 ? (
            <p className="mt-2 text-xs text-cream-dim">
              {news.failedSources.join(", ")} did not load this time. The rest are below.
            </p>
          ) : null}
          <div className="mt-6 grid gap-4">
            {news.articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}

      <p className="mt-10 text-sm leading-6 text-cream-dim">
        Sources this page asks:{" "}
        {nflNewsFeeds.map((feed) => feed.label).join(", ")}. Headlines and short
        snippets only — follow the link for the story. If you are still learning the
        jargon, start with{" "}
        <Link href="/learn" className="text-gold">
          the lessons
        </Link>
        .
      </p>
    </div>
  );
}
