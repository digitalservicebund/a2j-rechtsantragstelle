import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";
import { createReasonPage, REASON_TITLE_TEXT } from "../createReasonPage";
import { createFactsOfCases } from "../factsOfCases/createFactsOfCases";
import { createLegalAssessment } from "../legalAssessment/createLegalAssessment";

vi.mock("../factsOfCases/createFactsOfCases");
vi.mock("../legalAssessment/createLegalAssessment");
vi.mock("../addNewPageInCaseMissingVerticalSpace");

vi.mocked(createFactsOfCases).mockImplementation(() => vi.fn());
vi.mocked(createLegalAssessment).mockImplementation(() => vi.fn());
vi.mocked(addNewPageInCaseMissingVerticalSpace).mockImplementation(() =>
  vi.fn(),
);

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

  it("should call addNewPageInCaseMissingVerticalSpace for the creation of the reason page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(1);
  });
});
