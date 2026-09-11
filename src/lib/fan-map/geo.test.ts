import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { haversineMiles, nationFromParts } from "./geo";

describe("nationFromParts", () => {
  it("reads UK nations from geocoder state fields", () => {
    assert.equal(nationFromParts({ countryCode: "GB", state: "Scotland", name: "Wishaw" }), "Scotland");
    assert.equal(nationFromParts({ country: "United Kingdom", state: "England", county: "Kent" }), "England");
    assert.equal(nationFromParts({ countryCode: "GB", state: "Wales" }), "Wales");
    assert.equal(nationFromParts({ countryCode: "GB", county: "County Antrim" , state: "Northern Ireland" }), "Northern Ireland");
  });

  it("rejects places outside the UK", () => {
    assert.equal(nationFromParts({ countryCode: "IE", state: "Leinster", name: "Dublin" }), null);
    assert.equal(nationFromParts({ country: "France", city: "Paris" }), null);
  });
});

describe("haversineMiles", () => {
  it("puts Wishaw and Motherwell well inside 15 miles", () => {
    const miles = haversineMiles(55.7736, -3.918, 55.7887, -3.9918);
    assert.ok(miles > 2 && miles < 8);
  });
});
