import type { Metadata } from "next";
import { LearnQuiz } from "@/components/LearnQuiz";

export const metadata: Metadata = {
  title: "Learning quiz",
  description:
    "Twenty questions on the First Down Scotland path. Badges: Practice Squad, Rookie, Starter, Hall of Famer.",
};

export default function LearnQuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <LearnQuiz />
    </div>
  );
}
