import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your team",
  description:
    "The NFL team you picked: learn the game, then meet Scottish and UK fans of that side.",
};

export default function TeamResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
