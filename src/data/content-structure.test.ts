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

const PORTER =
  "despite being listed as a full participant on Monday and Tuesday";

describe("Our take", () => {
  it("keeps the approved Porter line and hides the TNF note after kick-off", () => {
    const pittsburgh = ourTakes.find((item) => item.headline.includes("Pittsburgh"));
    assert.ok(pittsburgh);
    assert.match(pittsburgh.take, new RegExp(PORTER));
    assert.equal(pittsburgh.expires_at, "2026-10-02T01:15+01:00");
    assert.equal(ourTakeAuthor(pittsburgh), OUR_TAKE_AUTHOR);
    assert.equal(isOurTakeCurrent(pittsburgh, new Date("2026-10-02T00:14:00+01:00")), true);
    assert.equal(isOurTakeCurrent(pittsburgh, new Date("2026-10-02T01:15:00+01:00")), false);
    const visible = sortedOurTakes().filter((item) =>
      isOurTakeCurrent(item, new Date("2026-09-30T12:00:00+01:00")),
    );
    assert.equal(visible.length, 4);
    assert.equal(visible[0].headline, "NFL admits the Rams were robbed");
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

  it("keeps the committed verdict file to the header until a week is filled", () => {
    const csv = readFileSync(path.join(process.cwd(), "src/data/start-sit-verdicts.csv"), "utf8");
    const records = rowsToRecords(parseCsv(csv), VERDICT_COLUMNS);
    assert.equal(records.length, 0);
  });
});
