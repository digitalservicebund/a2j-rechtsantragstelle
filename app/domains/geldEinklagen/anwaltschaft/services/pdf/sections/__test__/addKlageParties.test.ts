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

  it("aligns a natural person's representative and address, including wrapped lines", () => {
    const { doc, documentStruct } = createPdfTestContext();
    const address = {
      strasse: "Musterstraße",
      hausnummer: "1",
      plz: "12345",
      ort: "Musterstadt",
      land: "Deutschland",
    };

    addKlageParties(
      doc,
      documentStruct,
      {
        klagenden: [
          {
            type: "natuerliche-person",
            anrede: "frau",
            vorname: "Erika",
            nachname: "Musterfrau",
            ...address,
            "gesetzliche-vertretung": [
              {
                art: "elternteil",
                anrede: "herr",
                vorname: "Max",
                nachname: "Muster",
                ...address,
              },
            ],
          },
        ],
      },
      "klagende",
    );

    const indent = { indent: 8, indentAllLines: true };
    expect(doc.text).toHaveBeenCalledWith(
      "gesetzlich vertreten durch:",
      indent,
    );
    expect(doc.text).toHaveBeenCalledWith("Elternteil, ", {
      ...indent,
      continued: true,
    });
    expect(doc.text).toHaveBeenCalledWith(
      "Musterstraße 1, 12345 Musterstadt, Deutschland",
      indent,
    );
  });

  it("keeps all organization representative lines aligned when they wrap", () => {
    const { doc, documentStruct } = createPdfTestContext();
    const address = {
      strasse: "Musterstraße",
      hausnummer: "1",
      plz: "12345",
      ort: "Musterstadt",
      land: "Deutschland",
    };

    addKlageParties(
      doc,
      documentStruct,
      {
        klagenden: [
          {
            type: "organisation",
            orgName: "Muster GmbH",
            orgVertretungArt: "geschaeftsfuehrer-geschaeftsfuehrerin",
            orgVertretungAnrede: "herr",
            orgVertretungVorname: "Max",
            orgVertretungNachname: "Muster",
            ...address,
            "gesetzliche-vertretung": [
              {
                art: "partner-partnerin",
                anrede: "frau",
                vorname: "Erika",
                nachname: "Musterfrau",
                ...address,
              },
            ],
          },
        ],
      },
      "klagende",
    );

    const indent = { indent: 8, indentAllLines: true };
    expect(doc.text).toHaveBeenCalledWith(
      "gesetzlich vertreten durch:",
      indent,
    );
    expect(doc.text).toHaveBeenCalledWith(
      "Geschäftsführer / Geschäftsführerin, ",
      { ...indent, continued: true },
    );
    expect(doc.text).toHaveBeenCalledWith("Herr Max Muster");
    expect(doc.text).toHaveBeenCalledWith(
      "Partner / Partnerin, Frau Erika Musterfrau",
      indent,
    );
    expect(doc.text).toHaveBeenCalledWith(
      "Musterstraße 1, 12345 Musterstadt, Deutschland",
      indent,
    );
  });
});
