import { getOrderedKlageParties } from "../klagePartyOrdering";
import type { KlageParteien } from "../klagePartySchemas";

const naturalPerson = (id: string): KlageParteien[number] => ({
  id,
  type: "natuerliche-person",
  anrede: "none",
  vorname: "Max",
  nachname: "Muster",
  strasse: "Musterstrasse",
  hausnummer: "1",
  plz: "10115",
  ort: "Berlin",
  land: "Deutschland",
});
const organization: KlageParteien[number] = {
  id: "org",
  type: "organisation",
  orgName: "Example GmbH",
  orgVertretungArt: "geschaeftsfuehrer-geschaeftsfuehrerin",
  orgVertretungAnrede: "none",
  orgVertretungVorname: "Max",
  orgVertretungNachname: "Muster",
  strasse: "Musterstrasse",
  hausnummer: "1",
  plz: "10115",
  ort: "Berlin",
  land: "Deutschland",
};

describe("getOrderedKlageParties", () => {
  it.each(["klagende", "beklagte"] as const)(
    "derives %s display order and source indexes after additions/deletions",
    (relationship) => {
      const parties = [organization, naturalPerson("first")];
      const userData =
        relationship === "klagende"
          ? { klagenden: parties }
          : { beklagten: parties };
      const ordered = () =>
        getOrderedKlageParties(userData, relationship).map(
          ({ partei, arrayIndex, displayIndex }) => ({
            id: partei.id,
            arrayIndex,
            displayIndex,
          }),
        );

      expect(ordered()).toEqual([
        { id: "first", arrayIndex: 1, displayIndex: 0 },
        { id: "org", arrayIndex: 0, displayIndex: 1 },
      ]);
      expect(parties[0]).toBe(organization);
      parties.push(naturalPerson("second"));
      expect(ordered()).toEqual([
        { id: "first", arrayIndex: 1, displayIndex: 0 },
        { id: "second", arrayIndex: 2, displayIndex: 1 },
        { id: "org", arrayIndex: 0, displayIndex: 2 },
      ]);
      parties.splice(1, 1);
      expect(ordered()).toEqual([
        { id: "second", arrayIndex: 1, displayIndex: 0 },
        { id: "org", arrayIndex: 0, displayIndex: 1 },
      ]);
    },
  );
});
