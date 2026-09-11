import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "First Down Scotland is a learning hub, a community to meet fans of your NFL team, and a one-stop shop for that club, for Scotland and the rest of the UK.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="About" title={site.name}>
        <p>{site.tagline}</p>
      </PageIntro>

      <div className="mt-10 space-y-6 text-base leading-7 text-cream-dim">
        <p>
          This site is for people in Scotland and the rest of the UK who keep meaning
          to “get” American football, then bounce off the jargon, and then realise
          there is nowhere obvious to talk about it. Three jobs: learn the game,
          meet fans of the team you support, and keep that club in one place
          (news, fantasy, podcasts, depth, watch notes) so you are not hopping six
          American tabs.
        </p>
        <p>
          Discord is the chat home: general room, an NFL room, and a channel per
          club so you are not shouting into the void. Join from Community. The
          pub list is for the real-world bit: places that put the NFL on, where
          you can sit with people who picked the same side, or arrange a meetup
          in your team channel.
        </p>
        <p>
          You can find bits of this elsewhere online. The sell is that this app
          does it together, in UK English, aimed at Scottish and UK fans. It is
          not a TV listings clone, a US magazine, a betting tip sheet, or a live
          play-by-play machine. Kick-off times, live scores and standings come from
          ESPN’s public APIs and are shown in Europe/London. Rookie Watch uses that
          draft list plus Sleeper’s public season stats. If a feed fails, we say
          so. The tone
          is meant to be welcoming rather than matey-American. We use UK spelling
          (defence, favourite, organised) and we explain US words when the
          broadcast will say them differently.
        </p>
        <p>
          How the site uses your browser, analytics and the feedback form is on
          the{" "}
          <Link href="/privacy" className="text-gold">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <ul className="mt-10 space-y-3 text-sm">
        <li>
          <Link href="/learn" className="text-gold">
            Start the learning path →
          </Link>
        </li>
        <li>
          <Link href="/learn/rivalries" className="text-gold">
            NFL rivalries →
          </Link>
        </li>
        <li>
          <Link href="/learn/famous-players" className="text-gold">
            Famous players →
          </Link>
        </li>
        <li>
          <Link href="/mini-games" className="text-gold">
            Mini Games →
          </Link>
        </li>
        <li>
          <Link href="/pick-your-team" className="text-gold">
            Pick my team →
          </Link>
        </li>
        <li>
          <Link href="/community" className="text-gold">
            Community: Discord for your team →
          </Link>
        </li>
        <li>
          <Link href="/watch-near-you" className="text-gold">
            Pubs: meet fans of your team →
          </Link>
        </li>
        <li>
          <Link href="/this-week" className="text-gold">
            This week’s games →
          </Link>
        </li>
        <li>
          <Link href="/late-night-diary" className="text-gold">
            Late Night Diary →
          </Link>
        </li>
        <li>
          <Link href="/scores" className="text-gold">
            Live scores →
          </Link>
        </li>
        <li>
          <Link href="/score-history" className="text-gold">
            Has this score happened before? →
          </Link>
        </li>
        <li>
          <Link href="/standings" className="text-gold">
            Standings →
          </Link>
        </li>
        <li>
          <Link href="/rookies" className="text-gold">
            Rookie Watch →
          </Link>
        </li>
        <li>
          <Link href="/watch" className="text-gold">
            Where to watch →
          </Link>
        </li>
        <li>
          <Link href="/film-room" className="text-gold">
            Film room →
          </Link>
        </li>
        <li>
          <Link href="/news" className="text-gold">
            NFL news →
          </Link>
        </li>
        <li>
          <Link href="/podcasts" className="text-gold">
            Podcasts to lock onto →
          </Link>
        </li>
        <li>
          <Link href="/news/fantasy" className="text-gold">
            NFL fantasy news →
          </Link>
        </li>
        <li>
          <Link href="/history" className="text-gold">
            NFL history →
          </Link>
        </li>
        <li>
          <Link href="/teams" className="text-gold">
            Team profiles →
          </Link>
        </li>
        <li>
          <Link href="/feedback" className="text-gold">
            Feedback →
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="text-gold">
            Privacy Policy →
          </Link>
        </li>
      </ul>
    </div>
  );
}
