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
  it("leads with the 5 October notes and drops notes that expired overnight", () => {
    const cutoff = new Date("2026-10-05T08:55:00+01:00");
    assert.equal(ourTakes.length, 12);
    assert.equal(
      ourTakes.some((item) => item.headline.includes("Tonight's TNF")),
      false,
    );
    assert.ok(
      ourTakes.every((item) => !item.expires_at || new Date(item.expires_at).getTime() >= cutoff.getTime()),
    );
    assert.deepEqual(
      ourTakes.slice(0, 4).map((item) => item.headline),
      [
        "Thornton out indefinitely after his best Chiefs game",
        "Chiefs already ringing Tyreek Hill's agent",
        "Chargers are 0-4, and history isn't kind",
        "London leaves Washington on its third quarterback",
      ],
    );
    assert.ok(
      ourTakes
        .slice(0, 4)
        .every((item) => item.date === "2026-10-05" && item.author === OUR_TAKE_AUTHOR && !item.expires_at),
    );
    assert.equal(ourTakeAuthor(ourTakes[0]), OUR_TAKE_AUTHOR);
    assert.equal(sortedOurTakes()[0].headline, ourTakes[0].headline);
    assert.equal(
      sortedOurTakes().filter((item) => isOurTakeCurrent(item, cutoff)).length,
      12,
    );
    assert.equal(ourTakes.some((item) => item.date === "2026-10-03"), false);
    assert.equal(ourTakes.some((item) => item.headline.startsWith("Carolina lose")), false);
    assert.equal(ourTakes.some((item) => item.headline.startsWith("Seattle lose their rookie")), false);
    assert.ok(ourTakes.some((item) => item.headline.startsWith("Tony Romo")));
    assert.ok(ourTakes.some((item) => item.headline.includes("Jed York")));
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

  it("loads the committed Week 4 and Week 5 verdict rows", () => {
    const csv = readFileSync(path.join(process.cwd(), "src/data/start-sit-verdicts.csv"), "utf8");
    const records = rowsToRecords(parseCsv(csv), VERDICT_COLUMNS);
    assert.equal(records.length, 42);
    const rows = parseVerdictRows(records);
    assert.equal(rows.length, 42);
    const week4 = rows.filter((row) => row.week === 4);
    const week5 = rows.filter((row) => row.week === 5);
    assert.equal(week4.length, 21);
    assert.equal(week5.length, 21);
    assert.equal(
      matchVerdict(rows, 4, "Drake Maye", "Marcus Mariota")?.verdict,
      "Marcus Mariota",
    );
    assert.equal(matchVerdict(rows, 5, "Drake Maye", "Marcus Mariota"), null);
    const stafford = matchVerdict(rows, 5, "Jalen Hurts", "Matthew Stafford");
    assert.equal(stafford?.verdict, "Matthew Stafford");
    assert.equal(stafford?.confidence, "strong");
    assert.match(stafford?.reason ?? "", /51\+ pass attempts/);
    assert.equal(matchVerdict(rows, 4, "Matthew Stafford", "Jalen Hurts"), null);
  });
});
