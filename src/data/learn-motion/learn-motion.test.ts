import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getLesson } from "../lessons";
import { kickoffSteps } from "./kickoff";
import { playsMotionSteps } from "./plays";
import { pocketSteps } from "./pocket";
import { scoringSteps } from "./scoring";
import { turnoverSteps } from "./turnovers";
import type { LearnMotionStep } from "./types";

function assertReadableSteps(steps: readonly LearnMotionStep[]) {
  for (const step of steps) {
    assert.ok(step.call.length > 0, `${step.id} needs a call`);
    assert.ok(step.plain.length > 0, `${step.id} needs plain English`);
    assert.ok(step.caption.length > 20, `${step.id} caption is too thin`);
    assert.ok(step.title.length > 0, `${step.id} needs a title`);
  }
}

describe("scoring motion steps", () => {
  it("teaches a touchdown for 6 and a field goal for 3", () => {
    const text = scoringSteps.map((step) => `${step.title} ${step.caption}`).join(" ");
    assert.match(text, /touchdown/i);
    assert.match(text, /6 points/);
    assert.match(text, /field goal/i);
    assert.match(text, /three|3 points/i);
    assert.match(text, /end zone/i);
    assert.match(text, /posts/i);
  });

  it("labels every step in words, not only a call", () => {
    assertReadableSteps(scoringSteps);
  });
});

describe("pocket motion steps", () => {
  it("shows the rush collapsing and why pressure matters", () => {
    const text = pocketSteps.map((step) => `${step.title} ${step.caption}`).join(" ");
    assert.match(text, /pocket/i);
    assert.match(text, /rush/i);
    assert.match(text, /sack/i);
    assert.ok(pocketSteps.some((step) => step.rush === 0));
    assert.ok(pocketSteps.some((step) => step.rush === 1 && step.sack));
  });

  it("labels every step in words, not only a call", () => {
    assertReadableSteps(pocketSteps);
  });
});

describe("turnover motion steps", () => {
  it("flips possession on an interception and a fumble", () => {
    const text = turnoverSteps.map((step) => `${step.title} ${step.caption}`).join(" ");
    assert.match(text, /interception/i);
    assert.match(text, /fumble/i);
    assert.match(text, /defence/i);
    assert.ok(turnoverSteps.some((step) => step.possession === "offence"));
    assert.ok(turnoverSteps.some((step) => step.possession === "defence"));
    assert.ok(turnoverSteps.some((step) => step.possession === "loose"));
  });

  it("labels every step in words, not only a call", () => {
    assertReadableSteps(turnoverSteps);
  });
});

describe("kick-off motion steps", () => {
  it("shows flight and a basic return", () => {
    const text = kickoffSteps.map((step) => `${step.title} ${step.caption}`).join(" ");
    assert.match(text, /kick-off/i);
    assert.match(text, /in the air|flight/i);
    assert.match(text, /return/i);
    assert.match(text, /touchback/i);
    assert.deepEqual(
      kickoffSteps.map((step) => step.ball),
      ["tee", "flight", "catch", "return"],
    );
  });

  it("labels every step in words, not only a call", () => {
    assertReadableSteps(kickoffSteps);
  });
});

describe("plays motion steps", () => {
  it("animates only slant, screen, and outside run", () => {
    const plays = [...new Set(playsMotionSteps.map((step) => step.play))];
    assert.deepEqual(plays, ["slant", "screen", "outside-run"]);
    assert.equal(playsMotionSteps.length, 6);
  });

  it("labels every step in words, not only a call", () => {
    assertReadableSteps(playsMotionSteps);
  });
});

describe("shortlisted Learn embeds", () => {
  it("places the yes-list motion graphics in the right lessons", () => {
    const scoring = getLesson("how-you-score")?.blocks ?? [];
    const pocket = getLesson("offence-and-defence")?.blocks ?? [];
    const turnovers = getLesson("turnovers")?.blocks ?? [];
    const special = getLesson("special-teams")?.blocks ?? [];

    assert.ok(scoring.some((block) => block.type === "learn-motion" && block.id === "scoring"));
    assert.ok(pocket.some((block) => block.type === "learn-motion" && block.id === "pocket"));
    assert.ok(turnovers.some((block) => block.type === "learn-motion" && block.id === "turnovers"));
    assert.ok(special.some((block) => block.type === "learn-motion" && block.id === "kick-off"));
  });

  it("does not clutter lessons that were not shortlisted", () => {
    const skip = [
      "what-youre-watching",
      "the-clock",
      "penalties",
      "what-to-look-for",
      "the-draft",
      "fantasy-football",
    ];
    for (const slug of skip) {
      const blocks = getLesson(slug)?.blocks ?? [];
      assert.equal(
        blocks.filter((block) => block.type === "learn-motion").length,
        0,
        `${slug} should not gain a motion graphic`,
      );
    }
  });
});
