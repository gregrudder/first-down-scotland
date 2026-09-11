import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filledMsOk } from "./anti-spam";

describe("filledMsOk", () => {
  it("rejects missing, instant, and absurd fill times", () => {
    assert.equal(filledMsOk(undefined), false);
    assert.equal(filledMsOk(400), false);
    assert.equal(filledMsOk(2_999), false);
    assert.equal(filledMsOk(48 * 60 * 60 * 1000), false);
  });

  it("accepts a human-paced fill", () => {
    assert.equal(filledMsOk(3000), true);
    assert.equal(filledMsOk(12_000), true);
  });
});
