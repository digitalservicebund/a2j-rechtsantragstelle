import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addHauptantraege } from "../addHauptantraege";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";

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

  it("uses a hanging indent for additional claim bullets", () => {
    const { doc, documentStruct } = createPdfTestContext();
    vi.mocked(doc.widthOfString).mockReturnValue(5);

    addHauptantraege(doc, documentStruct, {
      hauptantrag: [
        {
          betragForderung: "100",
          beklagte: {},
          id: "zahlungsantrag-1",
          klagende: {},
          zinsbeginn: { day: "", month: "" },
          zinsende: { day: "", month: "" },
          nebenantraege: [
            {
              id: "neben",
              type: "nebenantrag",
              nebenantragArt: "mahnkosten",
              nebenantragBetrag: "10",
            },
          ],
        },
      ],
    });

    expect(doc.widthOfString).toHaveBeenCalledWith("• ");
    expect(doc.text).toHaveBeenCalledWith(
      expect.stringMatching(/^• .+/),
      PDF_MARGIN_HORIZONTAL + 12 + 5,
      undefined,
      { indent: -5 },
    );
  });
});
