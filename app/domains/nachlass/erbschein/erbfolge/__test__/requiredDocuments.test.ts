import { describe, expect, it } from "vitest";
import { collectRequiredDocuments } from "../requiredDocuments";

describe("collectRequiredDocuments", () => {
  it("requires only the Sterbeurkunde for the deceased without second-order heirs", () => {
    expect(
      collectRequiredDocuments({ verstorbeneVorname: "Erblasser" }),
    ).toEqual([{ name: "Erblasser", documents: "Sterbeurkunde" }]);
  });

  describe("Ehepartner by familienstand", () => {
    it("requires the Heiratsurkunde for a married spouse", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          familienstand: "verheiratet",
          ehepartnerVorname: "Ehefrau",
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde" },
        { name: "Ehefrau", documents: "Heiratsurkunde" },
      ]);
    });

    it("adds the Ehevertrag when one exists", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          familienstand: "verheiratet",
          ehepartnerVorname: "Ehefrau",
          ehevertrag: "yes",
        }),
      ).toContainEqual({
        name: "Ehefrau",
        documents: "Heiratsurkunde, Ehevertrag",
      });
    });

    it("uses the last-spouse label and Scheidungsurteil when divorced", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          familienstand: "geschieden",
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde" },
        {
          name: "Letzter Ehepartner oder letzte Ehepartnerin",
          documents:
            "Rechtskräftiges Scheidungsurteil bzw. Scheidungsbeschluss",
        },
      ]);
    });

    it("uses the last-spouse label and Sterbeurkunde when widowed", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          familienstand: "verwitwet",
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde" },
        {
          name: "Letzter Ehepartner oder letzte Ehepartnerin",
          documents: "Sterbeurkunde",
        },
      ]);
    });

    it("lists no spouse when single", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          familienstand: "ledig",
        }),
      ).toEqual([{ name: "Erblasser", documents: "Sterbeurkunde" }]);
    });
  });

  describe("first order", () => {
    it("requires the Geburtsurkunde for living heirs and both certificates for the predeceased", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          kinder: [
            {
              vorname: "Kind",
              isAlive: "no",
              kinder: [{ vorname: "Enkelkind", isAlive: "yes" }],
            },
          ],
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde" },
        { name: "Kind", documents: "Sterbeurkunde, Geburtsurkunde" },
        { name: "Enkelkind", documents: "Geburtsurkunde" },
      ]);
    });
  });

  describe("second order", () => {
    it("adds the deceased's Geburtsurkunde as proof of the parents and skips living parents", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          elternteile: [{ vorname: "Vater", isAlive: "yes" }],
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde, Geburtsurkunde" },
      ]);
    });

    it("requires only the Sterbeurkunde for predeceased parents", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          elternteile: [{ vorname: "Vater", isAlive: "no" }],
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde, Geburtsurkunde" },
        { name: "Vater", documents: "Sterbeurkunde" },
      ]);
    });

    it("treats the parents' descendants like first-order heirs", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          elternteile: [
            {
              vorname: "Vater",
              isAlive: "no",
              kinder: [
                {
                  vorname: "Geschwister",
                  isAlive: "no",
                  kinder: [{ vorname: "Nichte", isAlive: "yes" }],
                },
              ],
            },
          ],
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde, Geburtsurkunde" },
        { name: "Vater", documents: "Sterbeurkunde" },
        { name: "Geschwister", documents: "Sterbeurkunde, Geburtsurkunde" },
        { name: "Nichte", documents: "Geburtsurkunde" },
      ]);
    });
  });
});
