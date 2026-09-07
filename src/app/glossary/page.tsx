import type { Metadata } from "next";
import { GlossaryExplorer } from "@/components/GlossaryExplorer";
import { PageIntro } from "@/components/PageIntro";
import { glossary } from "@/data/glossary";

export const metadata: Metadata = {
  title: "Jargon decoder",
  description:
    "A UK-English glossary of NFL words: downs, sacks, punts, pick-sixes and the rest.",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Glossary" title="Jargon decoder">
        <p>
          Commentary assumes you already know these. You do not have to. Search, or
          wander by letter. Where a term belongs to a lesson, we point you back.
        </p>
      </PageIntro>
      <div className="mt-10">
        <GlossaryExplorer entries={glossary} />
      </div>
    </div>
  );
}
