import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your team",
  description: "The NFL team you picked: colours, a short why, and where to start learning.",
};

export default function TeamResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
