import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MiniQuiz } from "@/components/MiniQuiz";
import { getMiniGame, getMiniGameSlugs } from "@/data/mini-games";

type MiniGamePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getMiniGameSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: MiniGamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getMiniGame(slug);
  if (!game) return { title: "Mini game" };
  return {
    title: game.title,
    description: game.summary,
  };
}

export default async function MiniGamePage({ params }: MiniGamePageProps) {
  const { slug } = await params;
  const game = getMiniGame(slug);
  if (!game) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <MiniQuiz game={game} />
    </div>
  );
}
