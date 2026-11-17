import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addHauptantraege } from "../addHauptantraege";

describe("addHauptantraege", () => {
  it("should show missing Hauptantraege notice when none was added", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addHauptantraege(doc, documentStruct, emptyUserData);

    expect(getPrintedText(doc)).toContain("Klageantrag");
    expect(getPrintedText(doc)).toContain(
      "Fehlende Angaben: Bezifferter Zahlungsantrag",
    );
    expect(getPrintedText(doc)).toContain(
      "Fehlende Angaben: Unbezifferter Schmerzensgeldantrag",
    );
  });

  it("should number Hauptantraege correctly", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addHauptantraege(doc, documentStruct, {
      ...emptyUserData,
      hauptantrag: [
        {
          betragForderung: "100",
          beklagte: {},
          id: "zahlungsantrag-1",
          klagende: {},
          zinsbeginn: { day: "", month: "" },
          zinsende: { day: "", month: "" },
        },
      ],
    });

    expect(getPrintedText(doc).some((text) => text.startsWith("1. "))).toBe(
      true,
    );
    expect(getPrintedText(doc)).not.toContain(
      "Fehlende Angaben: Bezifferter Zahlungsantrag",
    );
  });
});
