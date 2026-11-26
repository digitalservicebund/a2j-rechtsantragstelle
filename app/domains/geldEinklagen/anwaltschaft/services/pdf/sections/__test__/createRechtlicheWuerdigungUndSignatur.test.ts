import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { geldEinklagenAnwaltschaftFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/flowConfig";
import { gesellschaft } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/__test__/fixtures";
import { getPrunedUserDataFromSimulation } from "~/services/flow/flowEngine/pruneUserData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { createRechtlicheWuerdigungUndSignatur } from "../createRechtlicheWuerdigungUndSignatur";

const fontForText = (doc: PDFKit.PDFDocument, text: string) => {
  const textCalls = vi.mocked(doc.text).mock;
  const fontCalls = vi.mocked(doc.font).mock;
  const textIndex = textCalls.calls.findIndex(([value]) => value === text);
  expect(textIndex).toBeGreaterThanOrEqual(0);
  const textOrder = textCalls.invocationCallOrder[textIndex];
  const fontIndex = fontCalls.invocationCallOrder.findLastIndex(
    (order) => order < textOrder,
  );
  return fontCalls.calls[fontIndex]?.[0];
};

describe("createRechtlicheWuerdigungUndSignatur", () => {
  it.each([undefined, "", "  "])(
    "should display the rechtliche würdigung heading and report a missing signature for empty input %j",
    (rechtlicheWuerdigung) => {
      const { doc, documentStruct } = createPdfTestContext();

      createRechtlicheWuerdigungUndSignatur(doc, documentStruct, {
        ...emptyUserData,
        rechtlicheWuerdigung,
      });

      expect(getPrintedText(doc)).toContain("II. Rechtliche Würdigung");
      expect(getPrintedText(doc)).toContain(
        "Die Klage ist vollumfänglich begründet.",
      );
      expect(getPrintedText(doc)).toContain("Fehlende Angaben: Signatur");
    },
  );

  it("should print a non empty rechtliche würdigung and valid klagende signatory", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createRechtlicheWuerdigungUndSignatur(doc, documentStruct, {
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
    expect(doc.text).toHaveBeenCalledWith(
      "Frau Erika Muster",
      PDF_MARGIN_HORIZONTAL,
    );
    expect(doc.text).toHaveBeenCalledWith(
      "(Rechtsanwältin)",
      PDF_MARGIN_HORIZONTAL,
    );
    expect(fontForText(doc, "Frau Erika Muster")).toBe(FONTS_BUNDESSANS_BOLD);
    expect(fontForText(doc, "(Rechtsanwältin)")).toBe(FONTS_BUNDESSANS_REGULAR);
    expect(getPrintedText(doc)).not.toContain("Fehlende Angaben: Signatur");
  });

  it("prints all responsible people from the PDF download data as signatures", () => {
    const { doc, documentStruct } = createPdfTestContext();
    const userData = getPrunedUserDataFromSimulation(
      geldEinklagenAnwaltschaftFlowConfig,
      {
        klagendeProzessbevollmaechtigte: [
          {
            ...gesellschaft,
            "verantwortende-personen": [
              {
                titel: "dr",
                vorname: "Erika",
                nachname: "Muster",
                berufsbezeichnung: "Rechtsanwältin",
              },
              {
                titel: "",
                vorname: "Max",
                nachname: "Beispiel",
                berufsbezeichnung: "",
              },
            ],
          },
        ],
      } as unknown as Parameters<typeof getPrunedUserDataFromSimulation>[1],
    );

    createRechtlicheWuerdigungUndSignatur(doc, documentStruct, userData);

    expect(getPrintedText(doc)).toContain("Dr. Erika Muster");
    expect(getPrintedText(doc)).toContain("(Rechtsanwältin)");
    expect(getPrintedText(doc)).toContain("Max Beispiel");
    expect(fontForText(doc, "Dr. Erika Muster")).toBe(FONTS_BUNDESSANS_BOLD);
    expect(fontForText(doc, "Max Beispiel")).toBe(FONTS_BUNDESSANS_BOLD);
    expect(getPrintedText(doc)).not.toContain("Fehlende Angaben: Signatur");
  });
});
