import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import {
  ASSUMED_SETTLEMENT_SECTION_TEXT,
  CLAIM_FULL_JUSTIFIED_TEXT,
  createLegalAssessment,
  LEGAL_ASSESSMENT_TEXT,
} from "../createLegalAssessment";

describe("createLegalAssessment", () => {
  it("should render document with legal assessment text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      LEGAL_ASSESSMENT_TEXT,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should render document with claim full justified text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(CLAIM_FULL_JUSTIFIED_TEXT);
  });

  it("should render document with assumed settlement section text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(ASSUMED_SETTLEMENT_SECTION_TEXT);
  });

  it("should render document with claim person name", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Fr. Test-test Test");
  });
});
