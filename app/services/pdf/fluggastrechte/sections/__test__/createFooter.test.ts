import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createBankInformation } from "../createBankInformation";
import { createFooter } from "../createFooter";
import { createPageNumber } from "../createPageNumber";
import { createStamp } from "../createStamp";

vi.mock("../createBankInformation");
vi.mock("../createPageNumber");
vi.mock("../createStamp");

vi.mocked(createStamp).mockImplementation(() => vi.fn());
vi.mocked(createPageNumber).mockImplementation(() => vi.fn());
vi.mocked(createBankInformation).mockImplementation(() => vi.fn());

describe("createFooter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call the createBankInformation for the creation of page footer", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 1, count: 1 });

    createFooter(mockDoc, mockStruct, userDataMock);

    expect(createBankInformation).toBeCalledTimes(1);
  });

  it("should call the createPageNumber for the creation of page footer", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 1, count: 1 });

    createFooter(mockDoc, mockStruct, userDataMock);

    expect(createPageNumber).toBeCalledTimes(1);
  });

  it("should call the createStamp for the creation of page footer", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 1, count: 1 });

    createFooter(mockDoc, mockStruct, userDataMock);

    expect(createStamp).toBeCalledTimes(1);
  });
});
