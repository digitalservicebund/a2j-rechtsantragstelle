import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createPageFooter } from "../../createPageFooter";
import { createLastSentences } from "../createLastSentences";
import { createSecondPage, REASON_TITLE_TEXT } from "../createSecondPage";
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

describe("createSecondPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render document with reason title text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createSecondPage(mockDoc, mockStruct);

    expect(mockDoc.text).toHaveBeenCalledWith(REASON_TITLE_TEXT, {
      align: "left",
    });
  });

  it("should call the createFactsOfCases for the creation of the second page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createSecondPage(mockDoc, mockStruct);

    expect(createFactsOfCases).toBeCalledTimes(1);
  });

  it("should call the createPageFooter for the creation of the second page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createSecondPage(mockDoc, mockStruct);

    expect(createPageFooter).toBeCalledTimes(1);
    expect(createPageFooter).toBeCalledWith(mockDoc, mockStruct);
  });

  it("should call the addTable for the creation of the second page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createSecondPage(mockDoc, mockStruct);

    expect(addTable).toBeCalledTimes(1);
  });

  it("should call the createLastSentences for the creation of the second page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createSecondPage(mockDoc, mockStruct);

    expect(createLastSentences).toBeCalledTimes(1);
  });
});
