import type { Metadata } from "next";
import { FeedbackForm } from "@/components/FeedbackForm";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Tell First Down Scotland what you tried, what confused you, and what broke: a short note for the TikTok test.",
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="TikTok test" title="Feedback">
        <p>
          You are in a small first wave: about ten NFL fans, not a call centre.
          A couple of honest lines is enough. Nothing here is a public comment
          thread.
        </p>
      </PageIntro>
      <div className="mt-10">
        <FeedbackForm />
      </div>
    </div>
  );
}
