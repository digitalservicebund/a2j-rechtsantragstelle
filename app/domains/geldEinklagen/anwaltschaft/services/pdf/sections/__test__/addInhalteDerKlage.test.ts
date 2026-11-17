import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addInhalteDerKlage } from "../addInhalteDerKlage";

describe("addInhalteDerKlage", () => {
  it("should display correctly the Klage Inhalt values", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addInhalteDerKlage(doc, documentStruct, {
      ...emptyUserData,
      zahlungsklageSubjectLine: "Offene Rechnung",
      zahlungsklageGesamtstreitwert: "1.250,00",
    });

    expect(
      getPrintedText(doc).some(
        (text) =>
          text.includes("Wegen: Zahlungsklage") &&
          text.includes("Offene Rechnung"),
      ),
    ).toBe(true);
    expect(getPrintedText(doc)).toContain("Streitwert: 1.250,00 Euro");
  });
});
