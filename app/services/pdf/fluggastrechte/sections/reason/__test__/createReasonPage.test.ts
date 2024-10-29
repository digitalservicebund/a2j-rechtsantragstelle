import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createPageFooter } from "../../createPageFooter";
import { createLastSentences } from "../createLastSentences";
import { createReasonPage, REASON_TITLE_TEXT } from "../createReasonPage";
import { createFactsOfCases } from "../factsOfCases/createFactsOfCases";
import { addTable } from "../table/addTable";

vi.mock("../factsOfCases/createFactsOfCases");
vi.mock("../../createPageFooter");
vi.mock("../table/addTable");
vi.mock("../createLastSentences");

vi.mocked(createFactsOfCases).mockImplementation(() => vi.fn());
vi.mocked(createPageFooter).mockImplementation(() => vi.fn());
vi.mocked(addTable).mockImplementation(() => vi.fn());
vi.mocked(createLastSentences).mockImplementation(() => vi.fn());

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

  it("should call the createPageFooter for the creation of the reason page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(createPageFooter).toBeCalledTimes(1);
    expect(createPageFooter).toBeCalledWith(mockDoc, mockStruct, userDataMock);
  });

  it("should call the addTable for the creation of the reason page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(addTable).toBeCalledTimes(1);
  });

  it("should call the createLastSentences for the creation of the reason page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(createLastSentences).toBeCalledTimes(1);
  });
});
