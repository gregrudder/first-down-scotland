import type { Guide } from "./types";

export const schemeBattlesGuide = {
  slug: "what-is-scheme-battles",
  title: "What Scheme Battles is, and why your town matters",
  description:
    "NFL Scheme Battles, explained: a UK town map of which clubs people follow, why it starts in Scotland, and what the public page will never show.",
  blurb:
    "A scheme is a neighbourhood, and a scheme is a playbook. The fan map uses both ideas: which NFL club runs your town.",
  blocks: [
    {
      type: "p",
      text: "NFL Scheme Battles is the map on this site. The question on the tin is “which team runs the scheme?” You pick an NFL club, you put a UK town on the map, and the town becomes a small argument: not about who is best in the abstract, but about who the people there actually follow. It is not a second scoreboard, and it is not a way for us to collect addresses. This guide explains what you are doing when you add yourself, what a stranger can see, and why a town in Scotland is a more interesting unit than “the UK” as a blob.",
    },
    {
      type: "p",
      text: "If you only wanted the button, it is on [Scheme Battles](/fan-map). If you wanted the chat that sits next to the map, that is [Community](/community). This page is the why.",
    },
    {
      type: "h2",
      text: "Two meanings of scheme",
    },
    {
      type: "p",
      text: "In a lot of Scotland, a scheme is a place: a housing scheme, a neighbourhood, the bit of the town you mean when you say where someone is from. In American football, a scheme is a system: the way a team lines up on offence or defence, the plays they trust, the structure a coach is running. The name on the map is a pun that only works if we keep both meanings. “Who runs the scheme?” means which NFL club has the people in that place. It is a local question wearing a coaching word.",
    },
    {
      type: "p",
      text: "You do not need to know Cover 2 to use the map. If you want that vocabulary later, the [lessons](/learn) start from the down and distance, not from a playbook. Scheme Battles is for fans who already have a club, or who just [picked one](/pick-your-team), and who want to know whether the choice is weird where they live. Usually it is not as weird as it feels.",
    },
    {
      type: "h2",
      text: "What you put on the map",
    },
    {
      type: "p",
      text: "You pick one of the 32 NFL clubs. You pick a UK town from the suggestions, so we are storing a real place and not a typo. You can say, if you want, how long you have followed the sport (a range, not a date of birth) and whether you would be up for a watch party. That is the lot. There is no account and no email. The first time you submit, we create one pin for that browser. Later visits from the same browser update the same pin, so you can change club or town without leaving a trail of old selves.",
    },
    {
      type: "p",
      text: "We store the club, the standardised town (country, nation, the council or region, the town name, and the town’s centre coordinates from a geocoder), and those optional answers. We do not store your name, your street, your postcode, your phone’s GPS, or a free-text address. The pin is not “you” in any public sense. It is a tally mark with a team attached, held at the resolution of a town.",
    },
    {
      type: "note",
      title: "One pin, on purpose",
      text: "One browser, one pin. That stops one person colouring a whole town on a bored evening. If you share a computer, you share a pin. That is a limitation we would rather have than a map anyone can stuff.",
    },
    {
      type: "h2",
      text: "What other people can see",
    },
    {
      type: "p",
      text: "The public map does not show individual pins. It shows town-level totals. By default, a town needs at least three registrations before we show which teams those fans support. Until then, a single person cannot be identified as “the Chiefs fan in a town of one”. We can raise that threshold. We do not drop it to zero for the sake of a busier graphic. If you are the first person in a town, you may see your town counted without a public team breakdown. That is the rule working.",
    },
    {
      type: "p",
      text: "When a town reaches the threshold, the leading club “owns” it for the sake of the game: the town is theirs until another club catches up and the lead flips. Flips show on the territory feed. It is a board game played with real towns, not a claim about politics or about who is welcome in the pub. If your club is second, you are still on the map. Second is how a flip eventually happens. The numbers on the homepage, when they appear, are live counts from those registrations. If nobody has joined yet, the page says the map starts from zero. We do not seed it with demo fans.",
    },
    {
      type: "h2",
      text: "Why a town, and why Scotland first",
    },
    {
      type: "p",
      text: "“UK NFL fans” is too big to be useful. It tells you that people exist, which you already knew, and it tells you nothing about whether you can meet them. A town is small enough that the answer can change your Sunday, and large enough that we are not mapping your house. You can imagine getting a bus across it. You can imagine a Discord message that says “anyone in Paisley for the 6pm game?” and means something.",
    },
    {
      type: "p",
      text: "The map is Scotland first, then the rest of the UK. That is a product decision, not a claim that England does not count. The examples we keep using (Wishaw, Motherwell, East Kilbride, Paisley, Dundee) are there because a fan site that only draws Glasgow and Edinburgh has already decided that smaller places are an afterthought. They are not. If you are in a Highland town, or a new-build estate that the geocoder files under a larger neighbour, pick the town the suggestions actually offer. Accuracy beats a romantic place name we cannot standardise.",
    },
    {
      type: "p",
      text: "England, Wales and Northern Ireland are on the same map. A UK view is there when you want it. The arguments are the same: which club runs this town, not which country is better at a sport it does not host a franchise for. There is still no NFL team based in Britain. The map is about fans, not about a stadium on the Clyde that does not exist.",
    },
    {
      type: "h2",
      text: "What the map will not do",
    },
    {
      type: "p",
      text: "It will not find you a pub by itself. Screens and opening hours are a different problem, and [Watch near you](/watch-near-you) is deliberately not a directory until a Glasgow partner and an Edinburgh partner are real. The [pubs and Discord guide](/guides/nfl-pubs-and-discord-scotland) is the practical half: how to ask a bar, and how to use the team channel in the meantime. A town with twelve fans and no agreed venue is still progress. It is not a listing.",
    },
    {
      type: "p",
      text: "It will not tell you the best team to support. Ownership is a headcount among people who chose to register, not a scouting report. If a big brand leads a city, that is a fact about who showed up. It is not advice. The [picking a team guide](/guides/picking-an-nfl-team) is where that decision lives, and it suggests you watch a game before you copy whoever is winning the map.",
    },
    {
      type: "p",
      text: "It will not message strangers for you. Watch-party interest is a flag on the registration, not a dating app and not a public list of addresses. If you want to talk to people, you do that in the [Discord](/community), where there are house rules and a name you chose, not through a pin. If you want your pin deleted, ask via [Contact](/contact). The privacy page says the same thing in the formal version, and it is the page that governs.",
    },
    {
      type: "h2",
      text: "How to use it this week",
    },
    {
      type: "list",
      items: [
        "Pick your club, or admit you have not and go to [Pick my team](/pick-your-team) first.",
        "Add your town on [Scheme Battles](/fan-map). One pin. Optional questions only if you mean them.",
        "Look at the towns around you. If the breakdown is hidden, the threshold has not been met. That is not a bug.",
        "Say hello in your team channel. Mention the town if you want company, not your street.",
        "Check [this week](/this-week) for a kick-off that is actually worth meeting for. A 6pm or 9pm window beats a 1am plan.",
        "If the copy on the map and this guide ever disagree about the rules, the map and the [privacy policy](/privacy) win, and tell us so we can fix the sentence.",
      ],
    },
    {
      type: "p",
      text: "The map gets more interesting when the next town flips, and it only flips if people who are not the leader bother to turn up. If your club is nowhere on it, that is not a reason to skip it. That is the reason to put the pin down. Somebody in the next scheme over is trying to work out if they are the only one, and the answer should be a number, not a guess.",
    },
  ],
} satisfies Guide;
