import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addProzessbevollmaechtigte } from "../addProzessbevollmaechtigte";

const representative = {
  type: "einzelkanzlei" as const,
  anrede: "herr" as const,
  titel: "",
  vorname: "Max",
  nachname: "Anwalt",
  berufsbezeichnung: "Rechtsanwalt",
  name: "Kanzlei Beispiel",
  strasse: "Hauptstraße",
  hausnummer: "2",
  plz: "10115",
  ort: "Berlin",
  land: "Deutschland",
  telefonnummer: "030 123456",
  email: "max@example.test",
  geschaeftszeichen: "AZ-123",
};

describe("addProzessbevollmaechtigte", () => {
  it("should print Prozessbevollmächtigte details", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addProzessbevollmaechtigte(
      doc,
      documentStruct,
      { ...emptyUserData, klagendeProzessbevollmaechtigte: [representative] },
      "klagende",
    );

    expect(getPrintedText(doc)).toContain(
      "Prozessbevollmächtigte Einzelkanzlei:",
    );
    expect(getPrintedText(doc)).toContain(
      "Hauptstraße 2, 10115 Berlin, Deutschland",
    );
    expect(getPrintedText(doc)).toContain("030 123456 | max@example.test");
    expect(getPrintedText(doc)).toContain("Geschäftszeichen: AZ-123");
  });

  it("should show missing Prozessbevollmächtigte", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addProzessbevollmaechtigte(doc, documentStruct, emptyUserData, "klagende");
    expect(getPrintedText(doc)).toContain(
      "Fehlende Angaben: Prozessbevollmächtigte",
    );

    const defendant = createPdfTestContext();
    addProzessbevollmaechtigte(
      defendant.doc,
      defendant.documentStruct,
      emptyUserData,
      "beklagte",
    );
    expect(getPrintedText(defendant.doc)).not.toContain(
      "Fehlende Angaben: Prozessbevollmächtigte",
    );
  });
});
