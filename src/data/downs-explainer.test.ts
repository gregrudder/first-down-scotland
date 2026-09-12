import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { downsExplainerSteps } from "./downs-explainer";

describe("downs explainer steps", () => {
  it("teaches four downs, a reset, and a turnover or punt", () => {
    const text = downsExplainerSteps.map((step) => `${step.title} ${step.caption}`).join(" ");
    assert.match(text, /four downs/i);
    assert.match(text, /10 yards/i);
    assert.match(text, /1st & 10/);
    assert.match(text, /reset/i);
    assert.match(text, /punt/i);
    assert.match(text, /turnover on downs/i);
  });

  it("labels every step in words, not only a call", () => {
    for (const step of downsExplainerSteps) {
      assert.ok(step.call.length > 0);
      assert.ok(step.plain.length > 0);
      assert.ok(step.caption.length > 20);
    }
  });
});
