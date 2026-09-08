import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TeamTheme } from "@/components/TeamTheme";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <TeamTheme />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
