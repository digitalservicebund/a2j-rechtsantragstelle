import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createBankInformation } from "../createBankInformation";
import { createPageFooter } from "../createPageFooter";
import { createPageNumber } from "../createPageNumber";
import { createStamp } from "../createStamp";

vi.mock("../createBankInformation");
vi.mock("../createPageNumber");
vi.mock("../createStamp");

vi.mocked(createStamp).mockImplementation(() => vi.fn());
vi.mocked(createPageNumber).mockImplementation(() => vi.fn());
vi.mocked(createBankInformation).mockImplementation(() => vi.fn());

describe("createPageFooter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call the createBankInformation for the creation of page foorter", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createPageFooter(mockDoc, mockStruct, 0);

    expect(createBankInformation).toBeCalledTimes(1);
  });

  it("should call the createPageNumber for the creation of page foorter", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createPageFooter(mockDoc, mockStruct, 0);

    expect(createPageNumber).toBeCalledTimes(1);
  });

  it("should call the createStamp for the creation of page foorter", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createPageFooter(mockDoc, mockStruct, 0);

    expect(createStamp).toBeCalledTimes(1);
  });
});
