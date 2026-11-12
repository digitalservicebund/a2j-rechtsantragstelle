import { getKlagePartyCheckboxLabel } from "../klageParteiCheckboxesHelpers";
import { type KlageParteien } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";

describe("getKlagePartyCheckboxLabel", () => {
  it("returns a natural person's formatted full name", () => {
    const party = {
      type: "natuerliche-person",
      anrede: "frau",
      titel: "dr",
      vorname: "jane",
      nachname: "Doe",
      strasse: "Street",
      hausnummer: "1",
      plz: "12345",
      ort: "Town",
      land: "Deutschland",
    } satisfies KlageParteien[number];

    expect(getKlagePartyCheckboxLabel(party)).toBe("Frau Dr. Jane Doe");
  });

  it("returns the organization name", () => {
    const party = {
      type: "organisation",
      orgName: "Example Organization",
      orgVertretungArt: "geschaeftsfuehrer-geschaeftsfuehrerin",
      orgVertretungAnrede: "herr",
      orgVertretungTitel: "",
      orgVertretungVorname: "Max",
      orgVertretungNachname: "Mustermann",
      strasse: "Street",
      hausnummer: "1",
      plz: "12345",
      ort: "Town",
      land: "Deutschland",
    } satisfies KlageParteien[number];

    expect(getKlagePartyCheckboxLabel(party)).toBe("Example Organization");
  });
});
