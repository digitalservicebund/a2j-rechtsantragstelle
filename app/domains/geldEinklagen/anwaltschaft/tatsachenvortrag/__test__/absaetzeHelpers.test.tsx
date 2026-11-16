import { render } from "@testing-library/react";
import {
  getBeweisBody,
  getBeweisTitle,
  getParteivernehmungBeweisCheckboxLabel,
} from "../absaetzeHelpers";

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

  describe("getBeweisTitle", () => {
    it.each([
      ["augenschein", "Beweis K2"],
      ["urkunde", "Beweis K2"],
      ["sachverstaendigengutachten", "Beweis K2"],
      ["zeuge", "Beweis Zeugnis"],
      ["parteivernehmung", "Beweis Parteivernehmung"],
    ] as const)("formats %s", (type, expectedTitle) => {
      expect(getBeweisTitle(type, 2, true)).toBe(expectedTitle);
    });

    it("rejects document evidence without a derived number", () => {
      expect(() => getBeweisTitle("urkunde", undefined)).toThrow(
        "Missing document number",
      );
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
});
