import type { Metadata } from "next";
import { FeedbackForm } from "@/components/FeedbackForm";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Tell First Down Scotland whether the lessons landed, and whether you found (or would find) fans of the team you support.",
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="A wee note" title="Feedback">
        <p>
          You are in a small first wave, not a call centre. Did the lessons make
          sense? Would you use Discord and the pub list to meet fans of the team
          you picked? Would £2 a month for the whole site feel fair? Suggest a
          feature if something is missing. A couple of honest lines is enough.
          Nothing here is a public comment thread.
        </p>
      </PageIntro>
      <div className="mt-10">
        <FeedbackForm />
      </div>
    </div>
  );
}
