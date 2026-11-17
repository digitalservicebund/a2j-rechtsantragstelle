import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addKlageParties } from "../addKlageParties";

describe("addKlageParties", () => {
  it("should print an ordered klagende natural person party with their address and party number", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addKlageParties(
      doc,
      documentStruct,
      {
        ...emptyUserData,
        klagenden: [
          {
            type: "natuerliche-person",
            parteiverhaeltnis: "klagende",
            anrede: "frau",
            titel: "",
            vorname: "Erika",
            nachname: "Musterfrau",
            strasse: "Musterstraße",
            hausnummer: "1",
            plz: "12345",
            ort: "Musterstadt",
            land: "Deutschland",
          },
        ],
      },
      "klagende",
    );

    expect(getPrintedText(doc)).toContain("in der Sache");
    expect(getPrintedText(doc)).toContain("Frau Erika Musterfrau");
    expect(getPrintedText(doc)).toContain(
      "Musterstraße 1, 12345 Musterstadt, Deutschland",
    );
    expect(getPrintedText(doc)).toContain("– Kläger zu 1 –");
  });

  it("should mark an absent party as missing", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addKlageParties(doc, documentStruct, emptyUserData, "beklagte");

    expect(getPrintedText(doc)).toContain("gegen");
    expect(getPrintedText(doc)).toContain("Fehlende Angaben: Beklagter");
  });
});
