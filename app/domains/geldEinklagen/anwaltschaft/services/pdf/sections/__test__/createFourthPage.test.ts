import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { createFourthPage } from "../createFourthPage";

describe("createFourthPage", () => {
  it("should add a missing-data notice when no Begründung is provided", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createFourthPage(doc, documentStruct, emptyUserData);

    expect(doc.addPage).toHaveBeenCalled();
    expect(getPrintedText(doc)).toContain("Begründung");
    expect(getPrintedText(doc)).toContain("Fehlende Angaben: Sachverhalt");
  });

  it("should print absaetze and attached document evidence", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createFourthPage(doc, documentStruct, {
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
      vortraege: [
        {
          antragId: "zahlungsantrag-1",
          absaetze: [
            {
              formulierung: "Die Rechnung ist offen.",
              beweise: [{ type: "urkunde", beschreibung: "Rechnung" }],
            },
          ],
        },
      ],
    });

    expect(getPrintedText(doc)).toContain("Die Rechnung ist offen.");
    expect(getPrintedText(doc)).toContain("Rechnung");
    expect(getPrintedText(doc)).not.toContain("Fehlende Angaben: Sachverhalt");
  });
});
