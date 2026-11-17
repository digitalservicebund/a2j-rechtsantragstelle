import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addBeklagendeProzessbevollmaechtigte } from "../addBeklagendeProzessbevollmaechtigte";

describe("addBeklagendeProzessbevollmaechtigte", () => {
  it("should not display a missing-data notice when Beklagende Prozessbevollmaechtigte is not present", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addBeklagendeProzessbevollmaechtigte(doc, documentStruct, emptyUserData);

    expect(getPrintedText(doc)).not.toContain(
      "Fehlende Angaben: Prozessbevollmächtigte",
    );
  });
});
