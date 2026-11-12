import { render } from "@testing-library/react";
import {
  getAbsaetzeBaseUrl,
  getBeweisArrayName,
  getBeweisBody,
  getBeweisCategory,
  getBeweisTitle,
  getNebenantragTitle,
  getParteivernehmungBeweisCheckboxLabel,
} from "../absaetzeHelpers";
import type { BeweisType } from "../tatsachenvortragSchemas";

describe("absaetzeHelpers", () => {
  describe("getParteivernehmungBeweisCheckboxLabel", () => {
    const organization = {
      type: "organisation",
      id: "11111111-1111-4111-8111-111111111111",
      orgName: "Example GmbH",
      orgVertretungArt: "geschaeftsfuehrer-geschaeftsfuehrerin",
      orgVertretungAnrede: "frau",
      orgVertretungTitel: "",
      orgVertretungVorname: "Default",
      orgVertretungNachname: "Representative",
      strasse: "Example Street",
      hausnummer: "1",
      plz: "12345",
      ort: "Berlin",
      land: "Deutschland",
    } as const;

    it("does not label the organization itself as an additional representative", () => {
      const { container } = render(
        getParteivernehmungBeweisCheckboxLabel(0, organization, "klagende"),
      );

      expect(container).toHaveTextContent("Example GmbH");
      expect(container).not.toHaveTextContent("weitere gesetzliche Vertretung");
    });

    it("labels the default and additional organization representatives distinctly", () => {
      const defaultRepresentative = render(
        getParteivernehmungBeweisCheckboxLabel(0, organization, "klagende", {
          vorname: "Default",
          source: "organisation-default",
        }),
      );
      expect(defaultRepresentative.container).toHaveTextContent(
        "gesetzliche Vertretung:",
      );
      expect(defaultRepresentative.container).not.toHaveTextContent(
        "weitere gesetzliche Vertretung",
      );

      const additionalRepresentative = render(
        getParteivernehmungBeweisCheckboxLabel(0, organization, "klagende", {
          vorname: "Additional",
          source: "additional",
        }),
      );
      expect(additionalRepresentative.container).toHaveTextContent(
        "weitere gesetzliche Vertretung:",
      );
    });
  });

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
