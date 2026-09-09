export type GlossaryEntry = {
  term: string;
  short: string;
  longer?: string;
  lessonSlug?: string;
};

export const glossary: GlossaryEntry[] = [
  {
    term: "Audible",
    short: "The quarterback changes the play at the line after seeing the defence.",
  },
  {
    term: "Best ball",
    short: "A fantasy format where you draft a big squad and never set a weekly lineup: the app counts your best combination each week.",
    lessonSlug: "fantasy-football",
  },
  {
    term: "Blitz",
    short: "Extra defenders rush the quarterback instead of dropping into coverage.",
    lessonSlug: "plays",
  },
  {
    term: "Block",
    short: "Using your body to keep a defender away from the ball-carrier or quarterback.",
  },
  {
    term: "Bye week",
    short: "A week a team does not play during the regular season.",
  },
  {
    term: "Centre",
    short: "The offensive lineman who snaps the ball to the quarterback. US spelling: center.",
  },
  {
    term: "Challenge flag",
    short: "A red flag a coach throws to ask officials to review a call.",
  },
  {
    term: "Completion",
    short: "A thrown pass that is successfully caught by an attacker.",
  },
  {
    term: "Cornerback",
    short: "A defensive back who usually marks a wide receiver.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Coverage",
    short: "How the defence accounts for receivers: man-to-man or zone.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Compensatory pick",
    short: "An extra Draft pick awarded, usually later on, to clubs that lost more free agents than they signed.",
    lessonSlug: "the-draft",
  },
  {
    term: "Delay of game",
    short: "A penalty when the offence does not snap the ball before the play clock hits zero.",
    lessonSlug: "penalties",
  },
  {
    term: "Down",
    short: "One of four attempts to gain 10 yards. Also used as “second down”.",
    lessonSlug: "downs-and-distance",
  },
  {
    term: "Draft",
    short: "The annual event where clubs take turns picking college players. Seven rounds, late April.",
    lessonSlug: "the-draft",
  },
  {
    term: "Drive",
    short: "A series of plays by one offence, from when they get the ball until they score, punt or turn it over.",
    lessonSlug: "what-youre-watching",
  },
  {
    term: "End zone",
    short: "The 10-yard scoring area at each end of the field.",
    lessonSlug: "what-youre-watching",
  },
  {
    term: "Extra point",
    short: "The short kick after a touchdown, worth 1 point if it goes through.",
    lessonSlug: "how-you-score",
  },
  {
    term: "Fair catch",
    short: "A signal that a punt returner will catch the ball and not be tackled, and will not run.",
    lessonSlug: "special-teams",
  },
  {
    term: "False start",
    short: "An offensive player moves too early, before the snap. Five-yard penalty.",
    lessonSlug: "penalties",
  },
  {
    term: "Fantasy football",
    short: "NFL fantasy: you draft real NFL players onto a roster and score points from their stats. Not Fantasy Premier League.",
    lessonSlug: "fantasy-football",
  },
  {
    term: "Flag",
    short: "The yellow cloth an official throws to mark a penalty.",
    lessonSlug: "penalties",
  },
  {
    term: "Field goal",
    short:
      "A kick through the posts worth 3 points. If the defence catch a miss, including in the end zone, they can return it for a touchdown.",
    lessonSlug: "how-you-score",
  },
  {
    term: "First down",
    short: "A fresh set of four downs, earned by gaining the needed yards.",
    lessonSlug: "downs-and-distance",
  },
  {
    term: "Fourth down",
    short: "The last of the four attempts. Teams often punt, kick a field goal, or “go for it”.",
    lessonSlug: "downs-and-distance",
  },
  {
    term: "Fumble",
    short: "The ball is dropped or knocked loose. Either team can recover it.",
    lessonSlug: "turnovers",
  },
  {
    term: "Go route",
    short: "A straight sprint down the field: the deep ball. Also called a fade or streak.",
    lessonSlug: "plays",
  },
  {
    term: "Hail Mary",
    short:
      "A desperation deep pass into the end zone, usually late on the clock, when several receivers flood the same area and hope someone comes down with it.",
    lessonSlug: "plays",
  },
  {
    term: "Holding",
    short: "Illegally grabbing a player. Offensive holding is 10 yards; defensive holding is 5 and a first down.",
    lessonSlug: "penalties",
  },
  {
    term: "Huddle",
    short: "The little circle where a team hears the next play before lining up.",
  },
  {
    term: "Incomplete pass",
    short: "A throw that hits the ground or goes out of bounds. Clock stops, down is used.",
  },
  {
    term: "Interception",
    short: "A defender catches a pass meant for the offence.",
    lessonSlug: "turnovers",
  },
  {
    term: "Kick-off",
    short: "The kick that starts each half and follows most scores.",
    lessonSlug: "special-teams",
  },
  {
    term: "Kneel",
    short: "The quarterback takes a knee to run time off the clock while leading.",
    lessonSlug: "the-clock",
  },
  {
    term: "Line of scrimmage",
    short: "The line through the ball at the start of a play.",
    lessonSlug: "downs-and-distance",
  },
  {
    term: "Linebacker",
    short: "A defender who stands behind the defensive line and does a bit of everything.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Mock draft",
    short: "A guessed Draft order, published for fun. Not the real list. Rankings move.",
    lessonSlug: "the-draft",
  },
  {
    term: "Neutral zone",
    short: "The slim strip the width of the ball between the two lines. Crossing it early is offside.",
    lessonSlug: "penalties",
  },
  {
    term: "NFL",
    short: "National Football League: the top professional American football league.",
  },
  {
    term: "Offence",
    short: "The team with the ball. US broadcasts say “offense”.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Offside",
    short: "A defender is across the line of scrimmage when the ball is snapped.",
    lessonSlug: "penalties",
  },
  {
    term: "Option",
    short: "A play where the quarterback can hand off, keep, or throw depending on what the defence does.",
  },
  {
    term: "Pass interference",
    short: "Illegally preventing a catch. Defensive PI can be a large chunk of yards and a first down.",
    lessonSlug: "penalties",
  },
  {
    term: "Penalty",
    short: "A rule break. Officials throw a flag, stop the play, and walk off yards against the guilty team.",
    lessonSlug: "penalties",
  },
  {
    term: "Personal foul",
    short: "A 15-yard penalty for a dangerous or unsportsmanlike hit, including roughing the passer.",
    lessonSlug: "penalties",
  },
  {
    term: "Pick-six",
    short: "An interception returned for a touchdown.",
    lessonSlug: "turnovers",
  },
  {
    term: "Play-action",
    short: "A fake hand-off followed by a pass, designed to freeze linebackers.",
    lessonSlug: "plays",
  },
  {
    term: "Play-offs",
    short: "The knockout rounds after the regular season, ending at the Super Bowl. US: playoffs.",
  },
  {
    term: "Pocket",
    short: "The protected area the offensive line tries to keep around the quarterback.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "PPR",
    short: "Points Per Reception: a fantasy scoring setting where each catch is worth a point (or a fraction).",
    lessonSlug: "fantasy-football",
  },
  {
    term: "Punt",
    short: "Kicking the ball away on fourth down to flip field position.",
    lessonSlug: "special-teams",
  },
  {
    term: "Quarter",
    short: "One of four 15-minute periods. Two quarters make a half.",
    lessonSlug: "the-clock",
  },
  {
    term: "Quarterback",
    short: "The offensive player who takes most snaps and throws or hands the ball off.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Red zone",
    short: "Inside the opponent’s 20-yard line, where scoring becomes likely.",
    lessonSlug: "how-you-score",
  },
  {
    term: "Redraft",
    short: "A fantasy league that starts from scratch each season. The usual first format.",
    lessonSlug: "fantasy-football",
  },
  {
    term: "Return",
    short:
      "Running the ball back after a kick-off, punt, interception, or a field goal the defence have caught.",
    lessonSlug: "special-teams",
  },
  {
    term: "Running back",
    short: "An offensive player who takes hand-offs and short passes.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Sack",
    short: "Tackling the quarterback behind the line before they pass or hand off.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Safety",
    short: "Two points for the defence when they tackle an attacker in their own end zone. Also a defensive position.",
    lessonSlug: "how-you-score",
  },
  {
    term: "Scoreography",
    short: "Asking whether a final scoreline has happened before, and how rare it is. We keep a historical table for that.",
    lessonSlug: "how-you-score",
  },
  {
    term: "Scramble",
    short: "The quarterback runs because the pocket has collapsed, rather than by design.",
  },
  {
    term: "Screen pass",
    short: "A short throw to a receiver or back with blockers in front, usually after luring rushers upfield.",
    lessonSlug: "plays",
  },
  {
    term: "Slant",
    short: "A quick route: the receiver takes a step upfield, then cuts diagonally in.",
    lessonSlug: "plays",
  },
  {
    term: "Snap",
    short: "The action that starts a play: the centre passes the ball back from the ground.",
    lessonSlug: "downs-and-distance",
  },
  {
    term: "Special teams",
    short: "The kicking units: kick-off, punt, field goal and extra point.",
    lessonSlug: "special-teams",
  },
  {
    term: "Spike",
    short: "Throwing the ball into the ground on purpose to stop the clock. Costs a down.",
    lessonSlug: "the-clock",
  },
  {
    term: "Super Bowl",
    short: "The NFL championship game, played in February.",
  },
  {
    term: "Sweep",
    short: "An outside run: the back takes the ball and races around the edge rather than through the middle.",
    lessonSlug: "plays",
  },
  {
    term: "Tight end",
    short: "An offensive player who blocks and also catches passes.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Timeout",
    short: "A stoppage a team can call. Three per half in the regular season.",
    lessonSlug: "the-clock",
  },
  {
    term: "Touchback",
    short: "A kicked ball downed in the end zone; the receiving team starts at a set yard line.",
    lessonSlug: "special-teams",
  },
  {
    term: "Touchdown",
    short: "Six points for getting the ball into the opponent’s end zone.",
    lessonSlug: "how-you-score",
  },
  {
    term: "Turnover",
    short: "The defence takes the ball via interception, fumble, or a failed fourth down.",
    lessonSlug: "turnovers",
  },
  {
    term: "Two-minute warning",
    short: "An automatic timeout with two minutes left in the second and fourth quarters.",
    lessonSlug: "the-clock",
  },
  {
    term: "Two-point conversion",
    short: "After a touchdown, a run or pass from the 2-yard line worth 2 points instead of kicking.",
    lessonSlug: "how-you-score",
  },
  {
    term: "UDFA",
    short: "Undrafted free agent: a player who was not picked in the Draft, then signed anyway.",
    lessonSlug: "the-draft",
  },
  {
    term: "Waiver wire",
    short: "Unowned fantasy players, and the process for claiming them during the week.",
    lessonSlug: "fantasy-football",
  },
  {
    term: "Wide receiver",
    short: "An offensive player who lines up out wide and tries to catch passes.",
    lessonSlug: "offence-and-defence",
  },
  {
    term: "Yard",
    short: "The NFL’s unit of distance. About 91cm. The field is 100 yards between end zones.",
    lessonSlug: "what-youre-watching",
  },
];

export function glossaryByLetter(): { letter: string; entries: GlossaryEntry[] }[] {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term, "en-GB"));
  const groups = new Map<string, GlossaryEntry[]>();

  for (const entry of sorted) {
    const letter = entry.term.charAt(0).toUpperCase();
    const list = groups.get(letter) ?? [];
    list.push(entry);
    groups.set(letter, list);
  }

  return [...groups.entries()].map(([letter, entries]) => ({ letter, entries }));
}
