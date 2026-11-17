import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { createSecondPage } from "../createSecondPage";

describe("createSecondPage", () => {
  it("should display the beklagende, inhalte der Klage and Hauptantrag sections", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createSecondPage(doc, documentStruct, emptyUserData);

    expect(doc.addPage).toHaveBeenCalledWith(
      expect.objectContaining({ size: expect.anything() }),
    );
    expect(getPrintedText(doc)).toContain("gegen");
    expect(
      getPrintedText(doc).some((text) =>
        text.startsWith("Wegen: Zahlungsklage"),
      ),
    ).toBe(true);
    expect(getPrintedText(doc)).toContain("Klageantrag");
  });
});
