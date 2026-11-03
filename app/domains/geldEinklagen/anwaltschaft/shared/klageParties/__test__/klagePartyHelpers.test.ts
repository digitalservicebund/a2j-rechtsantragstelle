import { getBaseKlagePartyUrl } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";

describe("getBaseKlagePartyUrl", () => {
  it("returns the base URL for the klagende relationship", () => {
    expect(getBaseKlagePartyUrl("klagende")).toBe(
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden",
    );
  });

  it("returns the base URL for the beklagte relationship", () => {
    expect(getBaseKlagePartyUrl("beklagte")).toBe(
      "/geld-einklagen/anwaltschaft/beklagte-partei/beklagten",
    );
  });
});
