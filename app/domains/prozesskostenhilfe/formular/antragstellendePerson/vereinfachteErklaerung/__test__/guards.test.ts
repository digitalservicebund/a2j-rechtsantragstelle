import {
  famFG,
  vereinfachteErklaerungDone,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";

describe("guards", () => {
  describe("FamFG", () => {
    it("should return true if the criteria for FamFG is met", () => {
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "unterhalt",
          },
        }),
      ).toBe(true);
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "vollstreckung",
          },
        }),
      ).toBe(true);
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "abstammung",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the criteria for FamFG is not met", () => {
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "no",
            rechtlichesThema: "unterhalt",
          },
        }),
      ).toBe(false);
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "other",
          },
        }),
      ).toBe(false);
    });
  });

  describe("vereinfachteErklaerungDone", () => {
    it("should return true when the Vereinfachte Erklärung section is done", () => {
      const askVermoegenHappyPathContext: Partial<ProzesskostenhilfeVereinfachteErklaerungUserData> =
        {
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "01.01.2020",
          },
          livesTogether: "no",
          unterhaltsSumme: "100",
          minderjaehrig: "yes",
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "abstammung",
          hasEinnahmen: "no",
        };

      expect(
        vereinfachteErklaerungDone({
          context: {
            child: {
              vorname: "Max",
              nachname: "Mustermann",
              geburtsdatum: "01.01.2020",
            },
            livesTogether: "no",
            unterhaltsSumme: "100",
            minderjaehrig: "no",
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "abstammung",
            hasEinnahmen: "yes",
            hohesEinkommen: "no",
            einnahmen: [
              {
                beschreibung: "Einnahme",
                betrag: "100",
                zahlungsfrequenz: "quarterly",
              },
            ],
          },
        }),
      ).toBe(true);

      expect(
        vereinfachteErklaerungDone({
          context: {
            ...askVermoegenHappyPathContext,
            hasVermoegen: "no",
          },
        }),
      ).toBe(true);

      expect(
        vereinfachteErklaerungDone({
          context: {
            ...askVermoegenHappyPathContext,
            hasVermoegen: "yes",
            vermoegenUnder10000: "no",
          },
        }),
      ).toBe(true);

      expect(
        vereinfachteErklaerungDone({
          context: {
            ...askVermoegenHappyPathContext,
            hasVermoegen: "yes",
            vermoegenUnder10000: "yes",
            vermoegen: [{ beschreibung: "Test", wert: "100" }],
          },
        }),
      ).toBe(true);
    });
  });
});
