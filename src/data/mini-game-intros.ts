import type { MiniGameSlug } from "@/data/mini-game-types";

export type MiniGameIntro = {
  /** Three approved paragraphs. Empty strings hide the block. */
  paragraphs: readonly string[];
  /** Fact source. Rendered as a "Source" link. Not the fact sentence. */
  sourceUrl: string;
};

/**
 * Indexable intro copy for each mini-game, keyed by slug.
 * Paragraphs are approved prose. Leave a slug's paragraphs empty ("")
 * to hide that intro. Do not add Word count, Fact, or Checked lines:
 * those stay in the editorial notes, not on the page.
 */
export const miniGameIntros: Record<MiniGameSlug, MiniGameIntro> = {
  "rules": {
    "paragraphs": [
      "The Rules quiz is the natural first stop for anyone who has caught a few NFL highlights and wondered what on earth is going on. Its ten questions come straight from the site's learning path and cover the basics that make a game hang together: downs, scoring, the yellow line, turnovers and the flags officials throw. It suits complete beginners best, although seasoned fans might enjoy a quick check that the fundamentals are still in good order before the next kick-off.",
      "Playing is simple. There are 10 questions, and a full run takes about four minutes. Tap the answer that looks right, read the short note that explains it, then move on to the next one. Nothing is saved to an account, so there is no score to protect and no shame in getting a few wrong first time round. The notes are where most of the learning happens, so a wrong answer is often the most useful one.",
      "Scoring has not always looked the way it does now, either. The NFL only adopted the two-point conversion in 1994, so a scoring option that feels as old as the game itself is younger than plenty of the fans watching it."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/Two-point_conversion"
  },
  "who-am-i": {
    "paragraphs": [
      "Who am I? is a guessing game built around famous names. Each question gives three clues and four possible players, and the job is to work out who is being described. Every player comes from the site's learning section, so newer fans who have read those pages will have a head start, while seasoned fans should find it a pleasant warm-up. It is a handy way of putting a story to the names commentators mention every Sunday, and it rewards a bit of detective work as much as memory.",
      "The format is quick. There are 8 questions and the whole thing takes about four minutes. Read the clues, tap the name you think fits, read the note that follows, then move on to the next one. Nothing is saved to an account, so it is fine to have a guess, learn from the answer and come back later for another go.",
      "For anyone who gets the bug for the game's great players, there is a proper place of pilgrimage. The Pro Football Hall of Fame in Canton, Ohio, opened its doors on 7 September 1963, and it has been honouring the sport's biggest figures ever since."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/Pro_Football_Hall_of_Fame"
  },
  "downs": {
    "paragraphs": [
      "Down & distance hands over the coach's headset. Each question sets a scene: the down, the yards needed and where the ball sits on the field. The task is to pick the call most teams would usually make. It tests game sense rather than memory, so it suits beginners who have learned what the downs are and want to see how they shape decisions, as well as seasoned fans who like to shout advice at the telly on fourth down. There are no trick questions about obscure rules, just the everyday choices that decide how a drive unfolds.",
      "It works like the other mini-games. There are 8 questions and a run takes about five minutes. Tap an answer, read the note explaining why most sides make that call, then move on. Nothing is saved to an account, so it is easy to replay and see whether the thinking has sharpened.",
      "Anyone wanting a reliable dose of down-and-distance drama to practise on could do worse than American Thanksgiving. The Detroit Lions started their tradition of playing on the holiday in 1934, and apart from a gap between 1939 and 1944, the Thanksgiving game in Detroit has carried on ever since."
    ],
    "sourceUrl": "https://www.profootballhof.com/football-history/thanksgiving-and-the-nfl"
  },
  "rivalries": {
    "paragraphs": [
      "Rivalry match-up is about the fixtures that matter most to supporters. The questions ask who plays whom, and which famous moment belongs to which match-up, from freezing play-off afternoons to last-second finishes that fans still argue about. It suits fans with a season or two behind them best, but newcomers will pick up plenty along the way, because every answer comes with a short note filling in the story. Think of it as a crash course in the grudges that make certain dates on the fixture list feel bigger than the rest.",
      "Playing takes very little effort. There are 8 questions and the quiz lasts about four minutes. Tap the answer that seems right, read the note, then move on to the next question. Nothing is saved to an account, so there is no pressure and no record of any wrong guesses.",
      "The shape of the modern league helps explain why some of these fixtures come round so often. The current layout of eight divisions, each with four teams, dates from the 2002 season, after the arrival of the Houston Texans as the league's 32nd club prompted a full realignment."
    ],
    "sourceUrl": "https://www.profootballhof.com/news/moments-in-nfl-history-expansion-triggers-2002-realignment"
  },
  "super-bowl-that": {
    "paragraphs": [
      "Which Super Bowl was that? is a recall game for anyone who has sat up into the small hours for the big one. The questions describe famous finishes, standout MVP performances and the moments people still talk about, and the job is to match each one to the right game, Roman numeral and all. It suits seasoned fans best, though anyone who has watched a few Super Bowls or caught the highlights will recognise more than expected. It is about remembering the moments, not sitting through a history lecture.",
      "The format is quick and friendly. There are 8 questions and a run takes about four minutes. Tap an answer, read the note that explains it, then move on to the next one. Nothing is saved to an account, so it is easy to play again and see whether the memory improves.",
      "Today the game is one of the hottest tickets in sport, but that was not always the case. The very first Super Bowl, played in January 1967, is the only one that did not sell out: around 33,000 of the 94,000 seats at the Los Angeles Memorial Coliseum went unsold."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/Super_Bowl_I"
  },
  "nfl-or-nonsense": {
    "paragraphs": [
      "NFL or nonsense? mixes real league lore with made-up claims and asks which is which. That is harder than it sounds, because some of the genuine stories are dafter than anything invented. It suits almost everyone: beginners can use it to learn a few of the league's odd traditions, and seasoned fans can test how well their instincts hold up when the truth sounds ridiculous. The best approach is to trust nothing that seems too neat and to check twice before dismissing something as a wind-up.",
      "The quiz is short. There are 8 questions and it takes about four minutes. Tap the answer, read the note that sets the record straight, then move on to the next one. Nothing is saved to an account, so a confident wrong answer stays between the player and the screen.",
      "For a start, the league's own origin story sounds a bit like nonsense. The NFL traces its beginnings to a 1920 meeting held in a car showroom in Canton, Ohio, and the league did not even take the name National Football League until 1922."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/National_Football_League"
  },
  "name-the-catch": {
    "paragraphs": [
      "Name the catch is for anyone who has watched the same highlight a hundred times. Each question gives a few clues about an iconic grab or play, with no diagrams and no video, and the task is to name it. It suits seasoned fans who know their famous moments by heart, but newer supporters will get a lot out of it too, because each answer comes with a short note on what happened and why people still talk about it. It is a good way to build up the shared vocabulary that fans use when they mention a play by nickname alone.",
      "Playing is straightforward. There are 8 questions and the whole thing takes about four minutes. Read the clues, tap the answer, read the note, then move on. Nothing is saved to an account, so it is fine to guess and learn as you go.",
      "Every one of these moments depends on something that was once against the rules. The forward pass only became a legal play in American football in 1906, which makes every leaping grab in this quiz the product of a rule change."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/Forward_pass"
  },
  "rivalry-radar": {
    "paragraphs": [
      "Rivalry radar is a quick matching game about who belongs with whom. The questions cover grudge fixtures, nicknames and the clubs that cannot stand each other, but it is not a lesson on why the bad blood started, just a test of who lines up against whom. It suits fans who have followed a season or two, although beginners will find it a useful map of the league's liveliest relationships. Knowing these pairings makes the fixture list far more interesting, because some dates clearly carry extra weight for the supporters involved.",
      "It plays like the other quizzes. There are 8 questions and a run takes about four minutes. Tap an answer, read the short note, then move on to the next question. Nothing is saved to an account, so it is easy to have another go later.",
      "Some of these rivalries have roots in what used to be two separate competitions. The NFL and the rival American Football League announced their merger on 8 June 1966, and the two leagues officially became one before the 1970 season."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/AFL%E2%80%93NFL_merger"
  },
  "jersey-legends": {
    "paragraphs": [
      "Jersey number legends is about the numbers that have become shorthand for great players. Fans often talk about a famous number and expect everyone to know who is meant, and this quiz tests whether you do. It is not a kit-history exam, just a light test of which legend goes with which number. It suits fans who have watched a fair bit of the game or read about its greats, but newcomers will find the notes a handy introduction to names that still come up in almost every broadcast.",
      "The format is quick. There are 8 questions and a run takes about four minutes. Tap an answer, read the note that follows, then move on to the next question. Nothing is saved to an account, so there is no harm in guessing.",
      "The rules on who may wear which number have not stood still. In April 2021, NFL owners approved a change that let running backs, wide receivers and tight ends wear single-digit numbers, which had previously been limited to quarterbacks, kickers and punters."
    ],
    "sourceUrl": "https://www.nfl.com/news/nfl-passes-rule-expanding-eligible-jersey-numbers"
  },
  "draft-day-chaos": {
    "paragraphs": [
      "Draft day chaos looks back at the nights when clubs pick new talent, and at the selections, trades and slides people still discuss years later. It is fair trivia rather than a pile-on, so the aim is to remember what happened, not to mock anyone's career. It suits seasoned fans who follow the draft closely, but newer supporters will enjoy it too, since the notes explain why each moment became part of draft folklore. Anyone who has watched a green-room camera linger a little too long will feel at home here.",
      "Playing takes just a few minutes. There are 8 questions and a run takes about four minutes. Tap an answer, read the note, then move on to the next one. Nothing is saved to an account, so it is easy to try again and see how much sticks.",
      "The draft has produced surprises from the very beginning. The first NFL draft was held in 1936, and the very first player ever selected, Jay Berwanger, never played a game in the league."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/1936_NFL_draft"
  },
  "uk-kickoff-survival": {
    "paragraphs": [
      "UK kick-off survival is a practical quiz for anyone following the NFL from this side of the Atlantic. It mixes a bit of trivia with a lot of common sense about US kick-off times, late nights, early shifts and that very civilised tea-time window. The real question underneath it all is simple: what would a sensible Scot do? It suits complete beginners especially well, because working out when games actually start is half the battle, but seasoned fans who have survived a few Sunday nights might pick up some tips too.",
      "The format matches the rest of the mini-games. There are 8 questions and it takes about five minutes. Tap an answer, read the note, then move on to the next one. Nothing is saved to an account, so it is easy to come back for a refresher before the next big weekend.",
      "Scotland has its own chapter in the story of the sport over here. The Scottish Claymores, who played in the World League of American Football (later NFL Europe), won World Bowl '96 at Murrayfield, beating the Frankfurt Galaxy 32–27 in front of 38,982 fans."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/Scottish_Claymores"
  },
  "logo-colour-call": {
    "paragraphs": [
      "Logo & colour call asks you to name the club from a description of its kit, badge or helmet. There are text clues only, so it helps to have a good mental picture of what each team looks like on a Sunday. It suits fans who have watched plenty of games, although newcomers will find it a useful way to learn how to spot a team from across the room before the score graphic appears. Colours and helmets are often the quickest way to follow who is who on a busy highlights package.",
      "Playing is quick. There are 8 questions and the whole thing takes about four minutes. Tap the answer, read the note that explains it, then move on to the next question. Nothing is saved to an account, so it is fine to guess and learn from the notes.",
      "Helmets themselves have a surprisingly bumpy history. In 1948 the NFL banned the plastic helmet, regarding the hard material as an injury risk, before lifting the ban after just one year in 1949."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/Football_helmet"
  },
  "one-season-wonders": {
    "paragraphs": [
      "One-season wonders & storylines looks back at the years fans still bring up, the seasons remembered for a single record, a collapse, an unlikely hero or a moment of officiating chaos. It is about the storylines rather than tactics, so no film-room knowledge is needed. It suits fans who have followed the league for a while, but newer supporters will pick up plenty, since each note explains why that season became part of NFL folklore. It is a good way to understand the references that turn up whenever pundits start comparing eras.",
      "The quiz is short and simple. There are 8 questions and a run takes about four minutes. Tap an answer, read the note, then move on to the next one. Nothing is saved to an account, so there is no pressure and no permanent record of any wrong answers.",
      "Some storylines refuse to go away. The 1972 Miami Dolphins remain the only NFL team to finish a season with a perfect record, winning all 17 of their games through to their Super Bowl victory."
    ],
    "sourceUrl": "https://www.profootballhof.com/teams/miami-dolphins/team-history"
  },
  "build-a-quarterback": {
    "paragraphs": [
      "Build a Quarterback is for the argument that starts whenever a broadcast treats one player as the whole offence. You assemble one from real quarterbacks, one trait at a time. What counts as great depends on the down: how far the ball will go, whether it arrives where the hands are, the calm to throw as the rush arrives, a scramble when the picture has gone, and the read of a defence before the snap and again after it. Clutch, durability and leadership are the rest of the job. It suits a beginner who wants that explained, and anyone who already has a strong opinion.",
      "It plays as a short draft, not a quiz. There are eight slots and a salary cap of 64, and a run takes about five minutes. Each slot offers a handful of real quarterbacks. Spin that board once if the names do not suit, then tap the one you want. The ratings are our opinion for this game, not official grades. Each quarterback can be picked only once, so a name spent on arm strength is gone for clutch. Stay under the cap. Nothing is saved to an account.",
      "The job has not always been a passer standing in the pocket. In 1943 Sammy Baugh, playing for Washington, led the league in passing, in punting and in interceptions, the last of those while playing defence. One season, both sides of the ball."
    ],
    "sourceUrl": "https://en.wikipedia.org/wiki/Sammy_Baugh"
  }
} as Record<MiniGameSlug, MiniGameIntro>;

export function getMiniGameIntro(slug: string): MiniGameIntro | null {
  const intro = (miniGameIntros as Record<string, MiniGameIntro | undefined>)[slug];
  if (!intro) return null;
  const paragraphs = intro.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
  if (paragraphs.length === 0 || !intro.sourceUrl.trim()) return null;
  return { paragraphs, sourceUrl: intro.sourceUrl.trim() };
}
