import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAQuarterbackGame,
  TRAIT_IDS,
  quarterbacks,
  type TraitRatings,
} from "@/data/build-a-quarterback";
import { getMiniGameIntro } from "@/data/mini-game-intros";
import { getMiniGame, getMiniGameSlugs } from "@/data/mini-games";
import {
  ARCHETYPES,
  BOARD_SIZE,
  MIN_TRAIT_COST,
  SALARY_CAP,
  capNote,
  dealSlot,
  maxAffordableCost,
  minimumSpend,
  overallRating,
  pickArchetype,
  scoreDraft,
  shareSummary,
  slotSeed,
  traitCost,
  verdictBand,
  verdictFor,
  type ArchetypeId,
  type DraftPick,
} from "@/lib/build-a-quarterback";

const eighties = {
  arm: 80,
  accuracy: 80,
  pocket: 80,
  mobility: 80,
  iq: 80,
  clutch: 80,
  durability: 80,
  leadership: 80,
} satisfies TraitRatings;

describe("build a quarterback pool", () => {
  it("keeps a mid-sized pool of distinct quarterbacks", () => {
    assert.ok(quarterbacks.length >= 30 && quarterbacks.length <= 40);
    assert.equal(new Set(quarterbacks.map((qb) => qb.id)).size, quarterbacks.length);
    assert.equal(new Set(quarterbacks.map((qb) => qb.name)).size, quarterbacks.length);
  });

  it("leaves invented stat lines out of the career notes", () => {
    for (const qb of quarterbacks) {
      const text = `${qb.knownFor} ${qb.fact ?? ""}`;
      assert.doesNotMatch(text, /yards|touchdowns|completion percentage|passer rating/i);
    }
  });

  it("writes a UK-English intro in the same shape as the other mini-games", () => {
    const intro = getMiniGameIntro("build-a-quarterback");
    assert.ok(intro);
    assert.equal(intro.paragraphs.length, 2);
    assert.match(intro.sourceUrl, /^https:\/\/en\.wikipedia\.org\/wiki\/Sammy_Baugh$/);
    const text = intro.paragraphs.join(" ");
    assert.match(text, /offence/);
    assert.match(text, /defence/);
    assert.match(text, /Sammy Baugh/);
    assert.match(text, /1943/);
    assert.doesNotMatch(text, /short draft|salary cap|not official|Nothing is saved/i);
    assert.doesNotMatch(text, /\boffense\b|\bdefense\b|\bfavorite\b|\blorem\b|\bplaceholder\b|\btbd\b/i);
  });

  it("keeps an intro, and the sitemap entries, from the rest of the site", () => {
    for (const slug of getMiniGameSlugs()) {
      const intro = getMiniGameIntro(slug);
      assert.ok(intro, `${slug} should keep its intro`);
      assert.equal(intro.paragraphs.length, slug === "build-a-quarterback" ? 2 : 3, slug);
      assert.match(intro.sourceUrl, /^https:\/\//, slug);
    }
  });

  it("is listed for the mini-games index and sitemap", () => {
    assert.ok(getMiniGameSlugs().includes("build-a-quarterback"));
    const game = getMiniGame("build-a-quarterback");
    assert.equal(game?.kind, "build");
    assert.equal(game?.title, "Build a Quarterback");
    assert.equal(
      game?.summary,
      "One trait from a different quarterback, under a salary cap.",
    );
    assert.equal(game?.summary, buildAQuarterbackGame.summary);
    assert.doesNotMatch(game?.summary ?? "", /opinion|not official|Draft a dream/i);
  });
});

describe("trait cost and salary cap", () => {
  it("prices the bands", () => {
    assert.equal(traitCost(99), 14);
    assert.equal(traitCost(97), 14);
    assert.equal(traitCost(96), 11);
    assert.equal(traitCost(94), 11);
    assert.equal(traitCost(93), 9);
    assert.equal(traitCost(91), 9);
    assert.equal(traitCost(90), 7);
    assert.equal(traitCost(88), 7);
    assert.equal(traitCost(87), 5);
    assert.equal(traitCost(84), 5);
    assert.equal(traitCost(83), 4);
    assert.equal(traitCost(80), 4);
    assert.equal(traitCost(79), 3);
    assert.equal(traitCost(60), MIN_TRAIT_COST);
  });

  it("reserves a minimum for the slots still to come", () => {
    assert.equal(maxAffordableCost(SALARY_CAP, 8), SALARY_CAP - MIN_TRAIT_COST * 7);
    assert.ok(maxAffordableCost(SALARY_CAP - 14 * 3, 5) < 14);
    assert.ok(14 * 4 + MIN_TRAIT_COST * 4 > SALARY_CAP);
  });

  it("notes what is left in the cap", () => {
    assert.match(capNote(SALARY_CAP), /penny/);
    assert.match(capNote(SALARY_CAP - 8), /left 8/);
    assert.match(capNote(60), /60 of 64/);
  });
});

describe("overall rating and archetypes", () => {
  it("returns the shared number when every trait matches", () => {
    assert.equal(overallRating({ ...eighties, arm: 90, accuracy: 90, pocket: 90, mobility: 90, iq: 90, clutch: 90, durability: 90, leadership: 90 }), 90);
    assert.equal(overallRating({ ...eighties, arm: 60, accuracy: 60, pocket: 60, mobility: 60, iq: 60, clutch: 60, durability: 60, leadership: 60 }), 60);
  });

  it("weights accuracy above durability", () => {
    const accurate = overallRating({ ...eighties, accuracy: 99 });
    const durable = overallRating({ ...eighties, durability: 99 });
    assert.ok(accurate > durable);
    assert.equal(verdictBand(93), "high");
    assert.equal(verdictBand(92), "mid");
    assert.equal(verdictBand(86), "mid");
    assert.equal(verdictBand(85), "low");
  });

  it("names the four headline archetypes, plus the extras", () => {
    const labels = Object.values(ARCHETYPES).map((entry) => entry.label);
    for (const label of ["Gunslinger", "Dual-threat", "Game manager", "Pocket surgeon"]) {
      assert.ok(labels.includes(label), label);
    }

    assert.equal(
      pickArchetype({ ...eighties, mobility: 96, arm: 94, accuracy: 88 }),
      "dual-threat",
    );
    assert.equal(
      pickArchetype({ ...eighties, accuracy: 97, pocket: 95, mobility: 70, arm: 88 }),
      "pocket-surgeon",
    );
    assert.equal(
      pickArchetype({ ...eighties, arm: 98, accuracy: 86, clutch: 90, mobility: 80 }),
      "gunslinger",
    );
    assert.equal(
      pickArchetype({ ...eighties, iq: 96, accuracy: 90, arm: 84, mobility: 70, pocket: 88 }),
      "game-manager",
    );
    assert.equal(pickArchetype({ ...eighties, clutch: 98, arm: 90 }), "closer");
    assert.equal(pickArchetype({ ...eighties, durability: 99 }), "ironman");
  });

  it("gives every archetype a verdict in each band", () => {
    const ids = Object.keys(ARCHETYPES) as ArchetypeId[];
    for (const id of ids) {
      for (const overall of [80, 88, 95]) {
        const line = verdictFor(id, overall);
        assert.ok(line.length > 40, `${id} ${overall}`);
        assert.doesNotMatch(line, /lorem|todo|placeholder|\btbd\b/i);
      }
    }
  });
});

describe("draft board", () => {
  it("deals a spread, skips used names, and stays inside the cap", () => {
    const used = new Set(["josh-allen", "tom-brady"]);
    const board = dealSlot({
      trait: "arm",
      usedIds: used,
      capRemaining: SALARY_CAP,
      slotsLeft: 8,
      seed: 3,
    });
    assert.ok(board.length > 0 && board.length <= BOARD_SIZE);
    assert.ok(board.every((qb) => !used.has(qb.id)));
    const ceiling = maxAffordableCost(SALARY_CAP, 8);
    assert.ok(board.every((qb) => traitCost(qb.ratings.arm) <= ceiling));

    const ranked = [...quarterbacks]
      .filter((qb) => !used.has(qb.id))
      .sort((a, b) => b.ratings.arm - a.ratings.arm);
    const fourthBest = ranked[3]?.ratings.arm ?? 0;
    const lowest = Math.min(...board.map((qb) => qb.ratings.arm));
    assert.ok(lowest < fourthBest);

    const again = dealSlot({
      trait: "arm",
      usedIds: used,
      capRemaining: SALARY_CAP,
      slotsLeft: 8,
      seed: 3,
    });
    assert.deepEqual(
      board.map((qb) => qb.id),
      again.map((qb) => qb.id),
    );
  });

  it("only offers names that leave a legal finish", () => {
    const future = TRAIT_IDS.slice(1);
    const reserve = minimumSpend(new Set(), future);
    assert.ok(reserve >= MIN_TRAIT_COST * future.length);
    assert.ok(reserve < SALARY_CAP);
    const board = dealSlot({
      trait: "arm",
      usedIds: new Set(),
      capRemaining: SALARY_CAP,
      slotsLeft: 8,
      seed: 4,
    });
    for (const qb of board) {
      const cost = traitCost(qb.ratings.arm);
      const after = minimumSpend(new Set([qb.id]), future);
      assert.ok(cost + after <= SALARY_CAP, qb.name);
    }
    assert.ok(maxAffordableCost(SALARY_CAP - 14 * 3, 5) < 14);
  });

  it("finishes a full draft of the dearest offered name without going bust", () => {
    for (let seed = 1; seed <= 24; seed += 1) {
      const used = new Set<string>();
      let cap = SALARY_CAP;
      for (let slot = 0; slot < TRAIT_IDS.length; slot += 1) {
        const trait = TRAIT_IDS[slot] ?? "arm";
        const slotsLeft = TRAIT_IDS.length - slot;
        const board = dealSlot({
          trait,
          usedIds: used,
          capRemaining: cap,
          slotsLeft,
          seed: slotSeed(seed, slot, 0),
        });
        assert.ok(board.length > 0, `empty board seed ${seed} slot ${slot}`);
        const ceiling = maxAffordableCost(cap, slotsLeft);
        for (const qb of board) {
          assert.equal(used.has(qb.id), false);
          assert.ok(traitCost(qb.ratings[trait]) <= ceiling);
        }
        const pick = board[0];
        assert.ok(pick);
        cap -= traitCost(pick.ratings[trait]);
        used.add(pick.id);
      }
      assert.ok(cap >= 0);
      assert.equal(used.size, TRAIT_IDS.length);
    }
  });

  it("changes the board when you spin", () => {
    const first = dealSlot({
      trait: "clutch",
      usedIds: new Set(),
      capRemaining: SALARY_CAP,
      slotsLeft: 8,
      seed: slotSeed(11, 0, 0),
    }).map((qb) => qb.id);
    const spun = dealSlot({
      trait: "clutch",
      usedIds: new Set(),
      capRemaining: SALARY_CAP,
      slotsLeft: 8,
      seed: slotSeed(11, 0, 1),
    }).map((qb) => qb.id);
    assert.notDeepEqual(first, spun);
  });
});

describe("scored card", () => {
  it("scores eight different names into a shareable summary", () => {
    const picks: DraftPick[] = TRAIT_IDS.map((traitId, index) => {
      const qb = quarterbacks[index];
      assert.ok(qb);
      return {
        traitId,
        quarterbackId: qb.id,
        rating: qb.ratings[traitId],
        cost: traitCost(qb.ratings[traitId]),
      };
    });
    const scored = scoreDraft(picks);
    assert.ok(scored.overall >= 60 && scored.overall <= 99);
    assert.ok(scored.archetypeLabel.length > 0);
    assert.equal(scored.spent, picks.reduce((sum, pick) => sum + pick.cost, 0));

    const summary = shareSummary({
      archetypeLabel: scored.archetypeLabel,
      overall: scored.overall,
      verdict: scored.verdict,
      spent: scored.spent,
      lines: picks.map((pick) => ({
        trait: pick.traitId,
        name: quarterbacks.find((qb) => qb.id === pick.quarterbackId)?.name ?? pick.quarterbackId,
        rating: pick.rating,
      })),
      pageUrl: "https://www.firstdownscotland.com/mini-games/build-a-quarterback",
    });
    assert.match(summary, new RegExp(scored.archetypeLabel));
    assert.match(summary, new RegExp(`${scored.overall} overall`));
    assert.doesNotMatch(summary, /opinion|not an official/i);
    assert.match(summary, /Patrick Mahomes/);
    assert.match(summary, /build-a-quarterback/);
  });

  it("rejects a repeated quarterback", () => {
    const qb = quarterbacks[0];
    assert.ok(qb);
    const picks: DraftPick[] = TRAIT_IDS.map((traitId) => ({
      traitId,
      quarterbackId: qb.id,
      rating: qb.ratings[traitId],
      cost: traitCost(qb.ratings[traitId]),
    }));
    assert.throws(() => scoreDraft(picks), /twice/);
  });
});
