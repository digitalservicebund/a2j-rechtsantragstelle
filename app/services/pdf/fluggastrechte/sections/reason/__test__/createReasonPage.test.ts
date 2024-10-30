import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createReasonPage, REASON_TITLE_TEXT } from "../createReasonPage";
import { createFactsOfCases } from "../factsOfCases/createFactsOfCases";
import { createLegalAssessment } from "../legalAssessment/createLegalAssessment";

vi.mock("../factsOfCases/createFactsOfCases");
vi.mock("../legalAssessment/createLegalAssessment");

vi.mocked(createFactsOfCases).mockImplementation(() => vi.fn());
vi.mocked(createLegalAssessment).mockImplementation(() => vi.fn());

describe("createReasonPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render document with reason title text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(REASON_TITLE_TEXT, {
      align: "left",
    });
  });

  it("should call the createFactsOfCases for the creation of the reason page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(createFactsOfCases).toBeCalledTimes(1);
  });

  it("should call the createLegalAssessment for the creation of the reason page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(createLegalAssessment).toBeCalledTimes(1);
  });
});
