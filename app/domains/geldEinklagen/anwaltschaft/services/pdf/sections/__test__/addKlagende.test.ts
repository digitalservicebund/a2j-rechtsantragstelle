import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addKlagende } from "../addKlagende";

describe("addKlagende", () => {
  it("should render the Klagende heading and its missing-data notice", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addKlagende(doc, documentStruct, emptyUserData);

    expect(getPrintedText(doc)).toContain("in der Sache");
    expect(getPrintedText(doc)).toContain("Fehlende Angaben: Kläger");
  });
});
