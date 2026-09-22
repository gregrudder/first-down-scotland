import { guideAuthor, guideSeasonNote } from "@/data/guides";

export function EditorialNote({ updatedLabel }: { updatedLabel?: string }) {
  return (
    <p className="text-sm leading-6 text-cream-dim">
      {guideSeasonNote}
      {updatedLabel ? `, ${updatedLabel}` : ""}. {guideAuthor}.
    </p>
  );
}
