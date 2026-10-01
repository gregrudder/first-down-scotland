import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MiniGameIntro } from "@/components/MiniGameIntro";
import { MiniQuiz } from "@/components/MiniQuiz";
import { getMiniGameIntro } from "@/data/mini-game-intros";
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

  const intro = getMiniGameIntro(game.slug);

  return (
    <div className={`mx-auto px-4 py-12 sm:px-6 sm:py-16 ${intro ? "max-w-6xl" : "max-w-3xl"}`}>
      <div className={intro ? "grid items-start gap-10 lg:grid-cols-2" : undefined}>
        {intro ? (
          <MiniGameIntro title={game.title} kind={game.kind} minutes={game.minutes} intro={intro} />
        ) : null}
        <MiniQuiz game={game} embedded={Boolean(intro)} />
      </div>
    </div>
  );
}
