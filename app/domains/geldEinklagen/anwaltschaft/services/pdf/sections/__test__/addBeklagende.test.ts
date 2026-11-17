import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { addBeklagende } from "../addBeklagende";

describe("addBeklagende", () => {
  it("should render beklagte heading and its missing-data notice", () => {
    const { doc, documentStruct } = createPdfTestContext();

    addBeklagende(doc, documentStruct, emptyUserData);

    expect(getPrintedText(doc)).toContain("gegen");
    expect(getPrintedText(doc)).toContain("Fehlende Angaben: Beklagter");
  });
});
