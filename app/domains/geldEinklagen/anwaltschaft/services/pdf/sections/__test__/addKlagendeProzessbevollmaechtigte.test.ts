import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addKlagendeProzessbevollmaechtigte } from "../addKlagendeProzessbevollmaechtigte";

describe("addKlagendeProzessbevollmaechtigte", () => {
  it("should not display a missing-data notice when Klagende Prozessbevollmaechtigte is not present", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addKlagendeProzessbevollmaechtigte(doc, documentStruct, emptyUserData);

    expect(getPrintedText(doc)).toContain(
      "Fehlende Angaben: Prozessbevollmächtigte",
    );
  });
});
