import { describe, expect, it } from "vitest";
import { collectRequiredDocuments } from "../../requiredDocuments";
import {
  type Elternteil,
  type Kind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";
import { translations } from "~/services/translations/translations";

describe("collectRequiredDocuments", () => {
  it("requires only the Sterbeurkunde for the deceased without second-order heirs", () => {
    expect(
      collectRequiredDocuments({ verstorbeneVorname: "Erblasser" }),
    ).toEqual([
      expect.objectContaining({
        name: "Erblasser",
        documents: "Sterbeurkunde",
      }),
    ]);
  });

  describe("Ehepartner by familienstand", () => {
    it("requires the Heiratsurkunde for a married spouse", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          verstorbeneFamilienstand: "verheiratet",
          ehepartnerVorname: "Ehefrau",
        }),
      ).toEqual([
        expect.objectContaining({
          name: "Erblasser",
          documents: "Sterbeurkunde",
        }),
        expect.objectContaining({
          name: "Ehefrau",
          documents: "Heiratsurkunde",
        }),
      ]);
    });

    it("adds the Ehevertrag when one exists", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          verstorbeneFamilienstand: "verheiratet",
          ehepartnerVorname: "Ehefrau",
          hasEhevertrag: "yes",
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
          verstorbeneFamilienstand: "geschieden",
        }),
      ).toEqual([
        expect.objectContaining({
          name: "Erblasser",
          documents: "Sterbeurkunde",
        }),
        expect.objectContaining({
          name: "Letzter Ehepartner oder letzte Ehepartnerin",
          documents:
            "Rechtskräftiges Scheidungsurteil bzw. Scheidungsbeschluss",
        }),
      ]);
    });

    it("uses the last-spouse label and Sterbeurkunde when widowed", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          verstorbeneFamilienstand: "verwitwet",
        }),
      ).toEqual([
        expect.objectContaining({
          name: "Erblasser",
          documents: "Sterbeurkunde",
        }),
        expect.objectContaining({
          name: "Letzter Ehepartner oder letzte Ehepartnerin",
          documents: "Sterbeurkunde",
        }),
      ]);
    });

    it("Displays the erbanteil for the spouse when there are no children", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          verstorbeneFamilienstand: "verwitwet",
          ehepartnerVorname: "Ehefrau",
          ehepartnerNachname: "Mustermann",
        }),
      ).toEqual([
        expect.objectContaining({
          name: "Erblasser",
          documents: "Sterbeurkunde",
        }),
        expect.objectContaining({
          name: "Letzter Ehepartner oder letzte Ehepartnerin",
          additionalDisplayText: "(erhält das gesamte Erbe)",
          documents: "Sterbeurkunde",
        }),
      ]);
    });

    it("lists no spouse when single", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          verstorbeneFamilienstand: "ledig",
        }),
      ).toEqual([
        expect.objectContaining({
          name: "Erblasser",
          documents: "Sterbeurkunde",
        }),
      ]);
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
            } as Kind,
          ],
        }),
      ).toEqual([
        {
          name: "Erblasser",
          documents: "Sterbeurkunde",
          additionalDisplayText: `(${translations.nachlass.verstorbenePerson.de})`,
        },
        {
          name: "Kind",
          documents: "Sterbeurkunde, Geburtsurkunde",
          additionalDisplayText: `(${translations.nachlass.deceased.de})`,
        },
        { name: "Enkelkind", documents: "Geburtsurkunde" },
      ]);
    });

    it("displays the erbanteil for the heirs", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          hatteKinder: "yes",
          kinder: [
            {
              vorname: "Kind",
              isAlive: "yes",
            } as Kind,
            {
              vorname: "Kind2",
              isAlive: "yes",
            } as Kind,
          ],
        }),
      ).toEqual([
        expect.objectContaining({
          name: "Erblasser",
          documents: "Sterbeurkunde",
        }),
        expect.objectContaining({
          name: "Kind",
          additionalDisplayText: "(erhält 1/2 des Erbes)",
          documents: "Geburtsurkunde",
        }),
        expect.objectContaining({
          name: "Kind2",
          additionalDisplayText: "(erhält 1/2 des Erbes)",
          documents: "Geburtsurkunde",
        }),
      ]);
    });
  });

  describe("second order", () => {
    it("adds the deceased's Geburtsurkunde as proof of the parents and skips living parents", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          elternteile: [{ vorname: "Vater", isAlive: "yes" } as Elternteil],
        }),
      ).toEqual([
        {
          name: "Erblasser",
          documents: "Sterbeurkunde, Geburtsurkunde",
          additionalDisplayText: `(${translations.nachlass.verstorbenePerson.de})`,
        },
      ]);
    });

    it("requires only the Sterbeurkunde for predeceased parents", () => {
      expect(
        collectRequiredDocuments({
          verstorbeneVorname: "Erblasser",
          elternteile: [{ vorname: "Vater", isAlive: "no" } as Elternteil],
        }),
      ).toEqual([
        {
          name: "Erblasser",
          documents: "Sterbeurkunde, Geburtsurkunde",
          additionalDisplayText: `(${translations.nachlass.verstorbenePerson.de})`,
        },
        {
          name: "Vater",
          documents: "Sterbeurkunde",
          additionalDisplayText: `(${translations.nachlass.deceased.de})`,
        },
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
            } as Elternteil,
          ],
        }),
      ).toEqual([
        expect.objectContaining({
          name: "Erblasser",
          documents: "Sterbeurkunde, Geburtsurkunde",
        }),
        expect.objectContaining({ name: "Vater", documents: "Sterbeurkunde" }),
        expect.objectContaining({
          name: "Geschwister",
          documents: "Sterbeurkunde, Geburtsurkunde",
        }),
        {
          name: "Nichte",
          documents: "Geburtsurkunde",
          additionalDisplayText: "(erhält das gesamte Erbe)",
        },
      ]);
    });
  });
});
