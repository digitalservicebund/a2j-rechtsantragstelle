import {
  getAbsaetzeBaseUrl,
  getBeweisArrayName,
  getBeweisBody,
  getBeweisCategory,
  getBeweisTitle,
  getNebenantragTitle,
} from "../absaetzeHelpers";
import type { BeweisType } from "../tatsachenvortragSchemas";

describe("absaetzeHelpers", () => {
  describe("getAbsaetzeBaseUrl", () => {
    it("includes the nested Nebenantrag path when supplied", () => {
      expect(getAbsaetzeBaseUrl(2, 1)).toBe(
        "/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/hauptantrag/2/nebenantraege/1/absaetze",
      );
    });

    it("omits the Nebenantrag path when not supplied", () => {
      expect(getAbsaetzeBaseUrl(2)).toBe(
        "/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/hauptantrag/2/absaetze",
      );
    });
  });

  describe("getNebenantragTitle", () => {
    it("formats a Nebenantrag with its alphabetical index and type", () => {
      expect(
        getNebenantragTitle(
          {
            type: "nebenantrag",
            nebenantragArt: "mahnkosten",
            nebenantragBetrag: "10",
          },
          1,
          0,
        ),
      ).toBe("Nebenantrag 1b (Mahnkosten)");
    });

    it("formats an Annahmeverzug with its parent and alphabetical indexes", () => {
      expect(
        getNebenantragTitle(
          {
            type: "annahmeverzug",
            annahmeverzugsFeststellung: "on",
            annahmeverzugDatum: { day: "", month: "" },
          },
          0,
          1,
        ),
      ).toBe("Feststellungsantrag 2a (Annahmeverzug)");
    });
  });

  describe("getBeweisTitle", () => {
    it.each([
      ["augenschein", "Beweis K2"],
      ["urkunde", "Beweis K2"],
      ["sachverstaendigengutachten", "Beweis K2"],
      ["zeuge", "Beweis Zeugnis"],
      ["parteivernehmung", "Beweis Parteivernehmung"],
    ] as const)("formats %s", (type, expectedTitle) => {
      expect(getBeweisTitle(type, 1, true)).toBe(expectedTitle);
    });
  });

  describe("getBeweisBody", () => {
    it("returns the description for document evidence", () => {
      expect(
        getBeweisBody({
          type: "augenschein",
          beschreibung: "Foto des Schadens",
        }),
      ).toBe("Foto des Schadens");
    });

    it("omits the body for party examination evidence", () => {
      expect(getBeweisBody({ type: "parteivernehmung", personen: {} })).toBe(
        "",
      );
    });
  });

  describe("getBeweisArrayName", () => {
    it("selects the Hauptantrag evidence array", () => {
      expect(getBeweisArrayName(true)).toBe("hauptantrag#absaetze#beweise");
    });

    it("selects the nested Nebenantrag evidence array", () => {
      expect(getBeweisArrayName(false)).toBe(
        "hauptantrag#nebenantraege#absaetze#beweise",
      );
    });
  });

  describe("getBeweisCategory", () => {
    it.each([
      ["augenschein", "document"],
      ["urkunde", "document"],
      ["sachverstaendigengutachten", "document"],
      ["zeuge", "person"],
      ["parteivernehmung", "person"],
    ] as const)("categorizes %s", (type: BeweisType, expectedCategory) => {
      expect(getBeweisCategory(type)).toBe(expectedCategory);
    });
  });
});
