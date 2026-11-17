import { createPdfTestContext, getPrintedText } from "./pdfTestHelpers";
import { addMissingData } from "../addMissingData";

describe("addMissingData", () => {
  it("should print the missing field name in a paragraph", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addMissingData(doc, documentStruct, "Sachverhalt");

    expect(getPrintedText(doc)).toContain("Fehlende Angaben: Sachverhalt");
    expect(doc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
  });
});
