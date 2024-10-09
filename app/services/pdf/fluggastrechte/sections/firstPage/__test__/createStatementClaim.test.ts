import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  createStatementClaim,
  STATEMENT_CLAIM_AGREEMENT_SENTENCE,
  STATEMENT_CLAIM_COURT_SENTENCE,
  STATEMENT_CLAIM_SUBTITLE_TEXT,
  STATEMENT_CLAIM_TITLE_TEXT,
} from "../createStatementClaim";

describe("createStatementClaim", () => {
  it("should create the document with the statement claim correct", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_TITLE_TEXT);
    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_SUBTITLE_TEXT);
    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_COURT_SENTENCE);
    expect(mockDoc.text).toHaveBeenCalledWith(
      STATEMENT_CLAIM_AGREEMENT_SENTENCE,
    );
  });
});
