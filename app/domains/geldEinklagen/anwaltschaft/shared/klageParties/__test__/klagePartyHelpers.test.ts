import { getBaseKlagePartyUrl } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";

describe("getBaseKlagePartyUrl", () => {
  it("returns the base URL for the claimant relationship", () => {
    expect(getBaseKlagePartyUrl("klagende")).toBe(
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden",
    );
  });

  it("returns the base URL for the defendant relationship", () => {
    expect(getBaseKlagePartyUrl("beklagte")).toBe(
      "/geld-einklagen/anwaltschaft/beklagte-partei/beklagten",
    );
  });
});
