import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import type { NewsResult } from "@/lib/news";
import { formatFetchedAt } from "@/lib/time";

export function NewsFeedList({
  news,
  sourceLabels,
}: {
  news: NewsResult;
  sourceLabels: string[];
}) {
  if (!news.ok) {
    return (
      <div className="mt-8 rounded-2xl border border-live/40 bg-navy-2 p-6">
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
    );
  }

  return (
    <>
      <p className="mt-6 text-xs text-cream-dim">
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
      <p className="mt-10 text-sm leading-6 text-cream-dim">
        Sources this page asks: {sourceLabels.join(", ")}. Headlines and short
        snippets only — follow the link for the story. If you are still learning the
        jargon, start with{" "}
        <Link href="/learn" className="text-gold">
          the lessons
        </Link>
        .
      </p>
    </>
  );
}
