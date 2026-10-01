/**
 * Original intro for the UK kick-off planner.
 * Outside commentary: no "we" or "us" for the clubs. Plain UK English.
 * Facts are the 2026 clock change and the published kick-off windows only.
 */
export const kickoffIntroParagraphs = [
  "Following the NFL from Scotland is mostly a question of the clock. Kick-offs are fixed in the United States, and Britain sits five hours ahead of New York while British Summer Time lasts. The clocks go back on Sunday 25 October 2026. From that morning the same American window is an hour earlier in the UK, until the United States falls back on Sunday 1 November.",
  "The comfortable window is tea-time. A 1pm Eastern start is 6pm in Scotland for most of the season, and 5pm on the Sunday the clocks change. That is a full game after work, with the evening still free. London games, and the other International Series fixtures played in the afternoon in Europe, are easier still. They are usually on at 2:30pm while summer time lasts. On 25 October the game at Stade de France is at 1:30pm.",
  "The later Sunday window, around 4pm Eastern, lands near 9pm in Britain during summer time and near 8pm on 25 October. Fine if Monday morning is quiet, and a poor idea if the alarm is early. One Saturday in December, Seattle at Philadelphia, is listed for 10pm UK: late, but still the same evening.",
  "Thursday, Sunday and Monday night in the US begin after midnight over here. In summer that is 1:15am or 1:20am. On the weekend of 25 October those slots slip to just after midnight. A nap, a late start the next day, or a replay are the realistic options. The planner lists the full 2026 regular season for any of the 32 clubs, in Europe/London, with each kick-off tagged. The league flexes games, so the published times can move. Check again before booking a day off. For the ones that need a nap, the First Down Scotland Discord is where people watch along.",
] as const;

export function kickoffIntroWordCount(): number {
  return kickoffIntroParagraphs.join(" ").split(/\s+/).filter(Boolean).length;
}
