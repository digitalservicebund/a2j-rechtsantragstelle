import { describe, expect, it } from "vitest";
import { collectRequiredDocuments } from "../requiredDocuments";

describe("collectRequiredDocuments", () => {
  it("requires only the Sterbeurkunde for the deceased without second-order heirs", () => {
    expect(collectRequiredDocuments({ name: "Erblasser" })).toEqual([
      { name: "Erblasser", documents: "Sterbeurkunde" },
    ]);
  });

  describe("Ehepartner by familienstand", () => {
    it("requires the Heiratsurkunde for a married spouse", () => {
      expect(
        collectRequiredDocuments({
          name: "Erblasser",
          familienstand: "verheiratet",
          ehepartnerName: "Ehefrau",
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde" },
        { name: "Ehefrau", documents: "Heiratsurkunde" },
      ]);
    });

    it("adds the Ehevertrag when one exists", () => {
      expect(
        collectRequiredDocuments({
          name: "Erblasser",
          familienstand: "verheiratet",
          ehepartnerName: "Ehefrau",
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
          name: "Erblasser",
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
          name: "Erblasser",
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
          name: "Erblasser",
          familienstand: "ledig",
        }),
      ).toEqual([{ name: "Erblasser", documents: "Sterbeurkunde" }]);
    });
  });

  describe("first order", () => {
    it("requires the Geburtsurkunde for living heirs and both certificates for the predeceased", () => {
      expect(
        collectRequiredDocuments({
          name: "Erblasser",
          kinder: [
            {
              name: "Kind",
              isAlive: "no",
              kinder: [{ name: "Enkelkind", isAlive: "yes" }],
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
          name: "Erblasser",
          elternteile: [{ name: "Vater", isAlive: "yes" }],
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde, Geburtsurkunde" },
      ]);
    });

    it("requires only the Sterbeurkunde for predeceased parents", () => {
      expect(
        collectRequiredDocuments({
          name: "Erblasser",
          elternteile: [{ name: "Vater", isAlive: "no" }],
        }),
      ).toEqual([
        { name: "Erblasser", documents: "Sterbeurkunde, Geburtsurkunde" },
        { name: "Vater", documents: "Sterbeurkunde" },
      ]);
    });

    it("treats the parents' descendants like first-order heirs", () => {
      expect(
        collectRequiredDocuments({
          name: "Erblasser",
          elternteile: [
            {
              name: "Vater",
              isAlive: "no",
              kinder: [
                {
                  name: "Geschwister",
                  isAlive: "no",
                  kinder: [{ name: "Nichte", isAlive: "yes" }],
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
