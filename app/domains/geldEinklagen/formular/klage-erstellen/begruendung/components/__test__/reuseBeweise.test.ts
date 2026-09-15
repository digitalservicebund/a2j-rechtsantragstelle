import { type GeldEinklagenFormularKlageErstellenUserData } from "../../../userData";
import {
  hasDocumentsToBeReusedFromOtherAbschnitte,
  hasPersonenToBeReusedFromOtherAbschnitte,
} from "../reuseBeweise";

describe("reuseBeweise", () => {
  describe("hasDocumentsToBeReusedFromOtherAbschnitte", () => {
    it("should return true if there are documents to be reused from other abschnitte", () => {
      const abschnitte = [
        {
          beschreibung: "Beschreibung 1",
          dokumenten: [{ beschreibung: "doc0" }],
        },
        {
          beschreibung: "Beschreibung 2",
          dokumenten: [{ beschreibung: "doc1" }],
        },
      ];
      const itemIndexAbschnitte = 0;
      const result = hasDocumentsToBeReusedFromOtherAbschnitte(
        abschnitte,
        itemIndexAbschnitte,
      );
      expect(result).toBe(true);
    });

    it("should return false if there are not documents to be reused from other abschnitte", () => {
      const abschnitte = [
        {
          beschreibung: "Beschreibung 1",
          dokumenten: [{ beschreibung: "doc0" }],
        },
        {
          beschreibung: "Beschreibung 2",
        },
      ];
      const itemIndexAbschnitte = 0;
      const result = hasDocumentsToBeReusedFromOtherAbschnitte(
        abschnitte,
        itemIndexAbschnitte,
      );
      expect(result).toBe(false);
    });
  });

  describe("hasPersonenToBeReusedFromOtherAbschnitte", () => {
    it("should return true if there are persons to be reused from other abschnitte", () => {
      const abschnitte = [
        {
          beschreibung: "Beschreibung 1",
          personen: [
            {
              personAuswahl: "anotherPerson",
              anrede: "none",
              email: "email0@example.com",
              personId: "personId0",
              title: "",
              telefonnummer: "Telefonnummer 0",
              vorname: "Vorname 0",
              nachname: "Nachname 0",
              strasse: "Strasse 0",
              hausnummer: "Hausnummer 0",
              plz: "PLZ 0",
              ort: "Ort 0",
              land: "Land 0",
            },
          ],
        },
        {
          beschreibung: "Beschreibung 2",
          personen: [
            {
              personAuswahl: "anotherPerson",
              anrede: "none",
              email: "email0@example.com",
              personId: "personId0",
              title: "",
              telefonnummer: "Telefonnummer 0",
              vorname: "Vorname 1",
              nachname: "Nachname 1",
              strasse: "Strasse 1",
              hausnummer: "Hausnummer 1",
              plz: "PLZ 1",
              ort: "Ort 1",
              land: "Land 1",
            },
          ],
        },
      ] satisfies GeldEinklagenFormularKlageErstellenUserData["abschnitte"];
      const itemIndexAbschnitte = 0;
      const result = hasPersonenToBeReusedFromOtherAbschnitte(
        abschnitte,
        itemIndexAbschnitte,
      );
      expect(result).toBe(true);
    });

    it("should return false if there are not persons to be reused from other abschnitte", () => {
      const abschnitte = [
        {
          beschreibung: "Beschreibung 1",
          personen: [
            {
              personAuswahl: "anotherPerson",
              anrede: "none",
              email: "email0@example.com",
              personId: "personId0",
              title: "",
              telefonnummer: "Telefonnummer 0",
              vorname: "Vorname 0",
              nachname: "Nachname 0",
              strasse: "Strasse 0",
              hausnummer: "Hausnummer 0",
              plz: "PLZ 0",
              ort: "Ort 0",
              land: "Land 0",
            },
          ],
        },
        {
          beschreibung: "Beschreibung 2",
        },
      ] satisfies GeldEinklagenFormularKlageErstellenUserData["abschnitte"];
      const itemIndexAbschnitte = 0;
      const result = hasPersonenToBeReusedFromOtherAbschnitte(
        abschnitte,
        itemIndexAbschnitte,
      );
      expect(result).toBe(false);
    });

    it("should return false if on the abschnitt two has persons, but there are either beklagte or klagende persons", () => {
      const abschnitte = [
        {
          beschreibung: "Beschreibung 1",
          personen: [
            {
              personAuswahl: "anotherPerson",
              anrede: "none",
              email: "email0@example.com",
              personId: "personId0",
              title: "",
              telefonnummer: "Telefonnummer 0",
              vorname: "Vorname 0",
              nachname: "Nachname 0",
              strasse: "Strasse 0",
              hausnummer: "Hausnummer 0",
              plz: "PLZ 0",
              ort: "Ort 0",
              land: "Land 0",
            },
          ],
        },
        {
          beschreibung: "Beschreibung 2",
          personen: [
            { personAuswahl: "beklagte", personId: "personId1" },
            { personAuswahl: "klagende", personId: "personId2" },
          ],
        },
      ] satisfies GeldEinklagenFormularKlageErstellenUserData["abschnitte"];
      const itemIndexAbschnitte = 0;
      const result = hasPersonenToBeReusedFromOtherAbschnitte(
        abschnitte,
        itemIndexAbschnitte,
      );
      expect(result).toBe(false);
    });
  });
});
