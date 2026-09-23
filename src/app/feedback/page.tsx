import { permanentRedirect } from "next/navigation";

/** Old contact URL. The public page is /contact. */
export default function FeedbackPage() {
  permanentRedirect("/contact");
}
