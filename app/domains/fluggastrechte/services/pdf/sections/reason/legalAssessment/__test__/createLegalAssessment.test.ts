import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";
import {
  ASSUMED_SETTLEMENT_SECTION_TEXT,
  CLAIM_FULL_JUSTIFIED_TEXT,
  createLegalAssessment,
  LEGAL_ASSESSMENT_TEXT,
} from "../createLegalAssessment";

vi.mock("../../addNewPageInCaseMissingVerticalSpace");

vi.mocked(addNewPageInCaseMissingVerticalSpace).mockImplementation(() =>
  vi.fn(),
);

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

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

    expect(mockDoc.text).toHaveBeenCalledWith("Herr Test-test Test");
  });

  it("should call function addNewPageInCaseMissingVerticalSpace twice", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(2);
  });
});
