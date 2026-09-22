import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialNote } from "@/components/EditorialNote";
import { GuideArticle } from "@/components/GuideArticle";
import { JsonLd } from "@/components/JsonLd";
import {
  getGuide,
  getGuideSlugs,
  guideAuthor,
  guideHref,
  guideReadingMinutes,
  guideUpdatedIso,
  guideUpdatedLabel,
  guides,
} from "@/data/guides";
import { absoluteUrl, site } from "@/lib/site";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide" };
  const url = absoluteUrl(guideHref(guide.slug));
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      type: "article",
      locale: "en_GB",
      siteName: site.name,
      publishedTime: guideUpdatedIso,
      modifiedTime: guideUpdatedIso,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = absoluteUrl(guideHref(guide.slug));
  const more = guides.filter((item) => item.slug !== guide.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          inLanguage: site.locale,
          datePublished: guideUpdatedIso,
          dateModified: guideUpdatedIso,
          mainEntityOfPage: url,
          author: {
            "@type": "Organization",
            name: guideAuthor,
            url: absoluteUrl("/about"),
          },
          publisher: {
            "@type": "Organization",
            name: site.name,
            url: absoluteUrl("/"),
            logo: {
              "@type": "ImageObject",
              url: absoluteUrl("/logo.png"),
            },
          },
        }}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Guide · about {guideReadingMinutes(guide)} min
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
        {guide.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-cream-dim">{guide.blurb}</p>
      <div className="mt-4">
        <EditorialNote updatedLabel={guideUpdatedLabel} />
      </div>
      <div className="gold-rule my-8" />
      <GuideArticle blocks={guide.blocks} />

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-2xl text-cream">More guides</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {more.map((item) => (
            <li key={item.slug}>
              <Link href={guideHref(item.slug)} className="text-gold hover:text-gold-soft">
                {item.title} →
              </Link>
            </li>
          ))}
          <li>
            <Link href="/guides" className="text-gold hover:text-gold-soft">
              All guides →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
