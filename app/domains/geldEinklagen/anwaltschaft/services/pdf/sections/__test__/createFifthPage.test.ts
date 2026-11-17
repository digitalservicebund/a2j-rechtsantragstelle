import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { createFifthPage } from "../createFifthPage";

describe("createFifthPage", () => {
  it("should not display rechtliche würdigung and reports a missing signature", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createFifthPage(doc, documentStruct, {
      ...emptyUserData,
      rechtlicheWuerdigung: "  ",
    });

    expect(getPrintedText(doc)).not.toContain("II. Rechtliche Würdigung");
    expect(getPrintedText(doc)).toContain(
      "Die Klage ist vollumfänglich begründet.",
    );
    expect(getPrintedText(doc)).toContain("Fehlende Angaben: Signatur");
  });

  it("should print a non empty rechtliche würdigung and valid klagende signatory", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createFifthPage(doc, documentStruct, {
      ...emptyUserData,
      rechtlicheWuerdigung: "Der Anspruch folgt aus dem Vertrag.",
      klagendeProzessbevollmaechtigte: [
        {
          type: "einzelkanzlei",
          anrede: "frau",
          titel: "",
          vorname: "Erika",
          nachname: "Muster",
          berufsbezeichnung: "Rechtsanwältin",
          name: "",
          strasse: "Musterstraße",
          hausnummer: "1",
          plz: "12345",
          ort: "Musterstadt",
          land: "Deutschland",
          telefonnummer: "",
          email: "",
          geschaeftszeichen: "",
        },
      ],
    });

    expect(getPrintedText(doc)).toContain("II. Rechtliche Würdigung");
    expect(getPrintedText(doc)).toContain(
      "Der Anspruch folgt aus dem Vertrag.",
    );
    expect(
      getPrintedText(doc).some((text) =>
        text.includes("Frau Erika Muster\n(Rechtsanwältin)"),
      ),
    ).toBe(true);
    expect(getPrintedText(doc)).not.toContain("Fehlende Angaben: Signatur");
  });
});
