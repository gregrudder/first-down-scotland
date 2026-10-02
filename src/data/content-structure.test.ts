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
  it("leads with the 2 October notes and hides the Carolina item after kick-off", () => {
    assert.equal(
      ourTakes.some((item) => item.headline.includes("Tonight's TNF")),
      false,
    );
    assert.equal(ourTakes.length, 7);
    assert.deepEqual(
      ourTakes.slice(0, 4).map((item) => item.headline),
      [
        "Watson does it again as the Browns go top of the AFC North",
        "Jerry Jones pays a second-rounder for Joey Porter Jr.",
        "Jayden Reed's season is over",
        "Carolina lose both starting corners just before facing the Lions",
      ],
    );
    assert.ok(ourTakes.slice(0, 4).every((item) => item.date === "2026-10-02"));
    assert.ok(ourTakes.slice(0, 3).every((item) => item.expires_at === undefined));
    const carolina = ourTakes[3];
    assert.equal(carolina.expires_at, "2026-10-05T01:20+01:00");
    assert.equal(
      new Date(carolina.expires_at ?? "").toISOString(),
      "2026-10-05T00:20:00.000Z",
    );
    assert.equal(ourTakeAuthor(carolina), OUR_TAKE_AUTHOR);
    assert.equal(isOurTakeCurrent(carolina, new Date("2026-10-05T01:19:00+01:00")), true);
    assert.equal(isOurTakeCurrent(carolina, new Date("2026-10-05T01:20:00+01:00")), false);
    const wfae = carolina.sources.find((source) => source.name === "WFAE");
    assert.equal(
      wfae?.url,
      "https://www.wfae.org/sports/2026-10-01/panthers-place-jaycee-horn-mike-jackson-on-injured-reserve",
    );
    const beforeKickoff = sortedOurTakes().filter((item) =>
      isOurTakeCurrent(item, new Date("2026-10-05T01:19:00+01:00")),
    );
    assert.equal(beforeKickoff.length, 7);
    assert.equal(beforeKickoff[0].headline, ourTakes[0].headline);
    const afterKickoff = sortedOurTakes().filter((item) =>
      isOurTakeCurrent(item, new Date("2026-10-05T01:20:00+01:00")),
    );
    assert.equal(afterKickoff.length, 6);
    assert.equal(
      afterKickoff.some((item) => item.headline === carolina.headline),
      false,
    );
  });

  it("sorts a later date ahead of the seed batch", () => {
    const sorted = sortedOurTakes([
      ...ourTakes,
      {
        date: "2026-10-03",
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
