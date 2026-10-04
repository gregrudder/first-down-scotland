import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { getMiniGameSlugs } from "@/data/mini-games";
import { getMiniGameIntro, miniGameIntros } from "@/data/mini-game-intros";
import {
  checkedLabel,
  groupPubsByTown,
  parsePubRecords,
  pubPlace,
  toPublicPub,
} from "@/data/pub-directory";
import {
  isOurTakeCurrent,
  ourTakes,
  ourTakeAuthor,
  OUR_TAKE_AUTHOR,
  sortedOurTakes,
} from "@/data/our-take";
import { parseCsv, rowsToRecords } from "@/lib/csv";
import {
  VERDICT_COLUMNS,
  findPlayerByName,
  matchVerdict,
  normalizePlayerName,
  parseVerdictRows,
  projectionLean,
} from "@/lib/start-sit-logic";

describe("Our take", () => {
  it("leads with the 3 October notes and keeps notes that have not expired", () => {
    const cutoff = new Date("2026-10-03T18:10:00+01:00");
    assert.equal(ourTakes.length, 14);
    assert.equal(
      ourTakes.some((item) => item.headline.includes("Tonight's TNF")),
      false,
    );
    assert.ok(
      ourTakes.every((item) => !item.expires_at || new Date(item.expires_at).getTime() >= cutoff.getTime()),
    );
    assert.deepEqual(
      ourTakes.slice(0, 3).map((item) => item.headline),
      [
        "Tony Romo and CBS split for good",
        "The NFL bans 49ers owner Jed York for six games",
        "Seattle lose their rookie running back before the Bolts arrive",
      ],
    );
    assert.ok(
      ourTakes.slice(0, 3).every((item) => item.date === "2026-10-04" && item.author === OUR_TAKE_AUTHOR),
    );
    assert.equal(ourTakes[0].expires_at, undefined);
    assert.equal(ourTakes[1].expires_at, undefined);
    assert.equal(ourTakes[2].expires_at, "2026-10-04T21:25:00+01:00");
    const octoberThird = ourTakes.filter((item) => item.date === "2026-10-03");
    assert.deepEqual(
      octoberThird.map((item) => item.headline),
      [
        "No Jayden Daniels in London, so it's Mariota at Tottenham",
        "Justin Jefferson out against Miami",
        "Rams at 1-2, without Aaron Donald but with Puka back",
        "The 0-3 Chargers go to Seattle",
      ],
    );
    assert.ok(octoberThird.every((item) => item.date === "2026-10-03"));
    assert.deepEqual(
      octoberThird.map((item) => item.expires_at),
      [
        "2026-10-04T14:30:00+01:00",
        "2026-10-04T21:05:00+01:00",
        "2026-10-04T18:00:00+01:00",
        "2026-10-04T21:25:00+01:00",
      ],
    );
    const carolina = ourTakes.find((item) => item.headline.startsWith("Carolina lose"));
    assert.ok(carolina);
    assert.equal(carolina.expires_at, "2026-10-05T01:20+01:00");
    assert.equal(ourTakeAuthor(carolina), OUR_TAKE_AUTHOR);
    assert.equal(isOurTakeCurrent(carolina, new Date("2026-10-05T01:19:00+01:00")), true);
    assert.equal(isOurTakeCurrent(carolina, new Date("2026-10-05T01:20:00+01:00")), false);
    const beforeSunday = sortedOurTakes().filter((item) =>
      isOurTakeCurrent(item, new Date("2026-10-04T14:29:00+01:00")),
    );
    assert.equal(beforeSunday.length, 14);
    assert.equal(beforeSunday[0].headline, ourTakes[0].headline);
    const afterSundayNight = sortedOurTakes().filter((item) =>
      isOurTakeCurrent(item, new Date("2026-10-04T21:25:00+01:00")),
    );
    assert.equal(afterSundayNight.length, 9);
    assert.equal(
      afterSundayNight.some((item) => item.headline === carolina.headline),
      true,
    );
  });

  it("sorts a later date ahead of the seed batch", () => {
    const sorted = sortedOurTakes([
      ...ourTakes,
      {
        date: "2026-10-06",
        headline: "Later",
        take: "Later note.",
        sources: [],
      },
    ]);
    assert.equal(sorted[0].headline, "Later");
  });
});

describe("mini-game intros", () => {
  it("has approved prose and a source for every game", () => {
    for (const slug of getMiniGameSlugs()) {
      const intro = getMiniGameIntro(slug);
      assert.ok(intro, slug);
      assert.equal(intro.paragraphs.length, slug === "build-a-quarterback" ? 2 : 3);
      assert.match(intro.sourceUrl, /^https:\/\//);
      for (const paragraph of intro.paragraphs) {
        assert.equal(paragraph.includes("Word count"), false);
        assert.equal(paragraph.startsWith("Fact:"), false);
        assert.equal(paragraph.startsWith("Checked:"), false);
      }
    }
    assert.match(miniGameIntros.rules.paragraphs[2], /two-point conversion in 1994/);
  });
});

describe("pubs directory", () => {
  const csv = readFileSync(path.join(process.cwd(), "src/data/pubs.csv"), "utf8");
  const records = parsePubRecords(csv);
  const pubs = records.map(toPublicPub);

  it("loads the approved bars and keeps notes off the public view", () => {
    assert.equal(records.length, 32);
    assert.ok(records.every((record) => record.notes.length > 0));
    const bell = records.find((record) => record.name === "Bell Tree");
    assert.ok(bell);
    assert.equal(pubPlace(bell.town).town, "Dundee");
    assert.equal(pubPlace(bell.town).placeLabel, "Broughty Ferry");
    const publicBell = toPublicPub(bell);
    assert.equal(publicBell.town, "Dundee");
    assert.equal(publicBell.placeLabel, "Broughty Ferry");
    assert.equal(publicBell.checkedLabel, "Checked 1 Oct 2026");
    assert.equal("notes" in publicBell, false);
    const dundee = groupPubsByTown(pubs).find((group) => group.town === "Dundee");
    assert.ok(dundee);
    assert.ok(dundee.pubs.some((pub) => pub.name === "Bell Tree"));
    assert.equal(checkedLabel("2026-10-01"), "Checked 1 Oct 2026");
  });
});

describe("start/sit verdicts", () => {
  it("matches pairs in either order and tolerates Jr. and punctuation", () => {
    assert.equal(normalizePlayerName("J.J. McCarthy Jr."), normalizePlayerName("jj mccarthy"));
    assert.equal(normalizePlayerName("Travis Kelce Jr."), normalizePlayerName("Travis Kelce"));
    const catalog = [
      { id: "1", name: "J.J. McCarthy", searchRank: 20 },
      { id: "2", name: "Sam Darnold", searchRank: 40 },
    ];
    assert.equal(findPlayerByName(catalog, "JJ McCarthy Jr.")?.id, "1");
    const rows = parseVerdictRows([
      {
        week: "4",
        player_a: "Sam Darnold",
        player_b: "J.J. McCarthy Jr.",
        verdict: "Sam Darnold",
        confidence: "lean",
        reason: "The write-up.",
        source_url: "https://example.com/source",
        checked_date: "2026-10-01",
      },
    ]);
    const matched = matchVerdict(rows, 4, "J.J. McCarthy", "Sam Darnold");
    assert.equal(matched?.verdict, "Sam Darnold");
    assert.equal(matchVerdict(rows, 3, "J.J. McCarthy", "Sam Darnold"), null);
    assert.equal(matchVerdict(rows, 4, "Patrick Mahomes", "Josh Allen"), null);
    assert.equal(
      projectionLean(
        { name: "Sam Darnold", points: 16.2 },
        { name: "J.J. McCarthy", points: 12 },
      ),
      "Sam Darnold by 4.2 projected points.",
    );
  });

  it("loads the committed Week 4 verdict rows", () => {
    const csv = readFileSync(path.join(process.cwd(), "src/data/start-sit-verdicts.csv"), "utf8");
    const records = rowsToRecords(parseCsv(csv), VERDICT_COLUMNS);
    assert.equal(records.length, 21);
    const rows = parseVerdictRows(records);
    assert.equal(rows.length, 21);
    assert.ok(rows.every((row) => row.week === 4));
    assert.equal(
      matchVerdict(rows, 4, "Drake Maye", "Marcus Mariota")?.verdict,
      "Marcus Mariota",
    );
  });
});
