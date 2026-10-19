import { getBaseKlageParteiUrl } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParteiHelpers";

describe("getBaseKlageParteiUrl", () => {
  it("returns the base URL for the claimant relationship", () => {
    expect(getBaseKlageParteiUrl("klagende")).toBe(
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden",
    );
  });

  it("returns the base URL for the defendant relationship", () => {
    expect(getBaseKlageParteiUrl("beklagte")).toBe(
      "/geld-einklagen/anwaltschaft/beklagte-partei/beklagten",
    );
  });
});
