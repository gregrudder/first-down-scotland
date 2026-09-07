import { NewsThumb } from "@/components/NewsThumb";
import type { NewsArticle } from "@/lib/news";
import { formatUkDateTime } from "@/lib/time";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-navy-2">
      <div className="sm:flex sm:items-stretch">
        <NewsThumb src={article.imageUrl} alt="" />
        <div className="min-w-0 flex-1 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            {article.source}
          </p>
          <h2 className="mt-2 font-display text-xl text-cream">
            <a
              href={article.url}
              className="hover:text-gold"
              target="_blank"
              rel="noreferrer"
            >
              {article.title}
            </a>
          </h2>
          {article.publishedAt ? (
            <p className="mt-2 text-xs text-cream-dim">
              {formatUkDateTime(article.publishedAt)}
            </p>
          ) : (
            <p className="mt-2 text-xs text-cream-dim">Time not given by the feed</p>
          )}
          {article.snippet ? (
            <p className="mt-3 text-sm leading-6 text-cream-dim">{article.snippet}</p>
          ) : null}
          <p className="mt-4 text-sm">
            <a
              href={article.url}
              className="font-semibold text-gold"
              target="_blank"
              rel="noreferrer"
            >
              Read on {article.source} →
            </a>
          </p>
        </div>
      </div>
    </article>
  );
}
