import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { createPageNumber } from "~/services/pdf/footer/createPageNumber";
import { createStamp } from "~/services/pdf/footer/createStamp";
import { createBankInformation } from "../createBankInformation";
import { createFooter } from "../createFooter";

vi.mock("../createBankInformation");
vi.mock("~/services/pdf/footer/createPageNumber", () => ({
  createPageNumber: vi.fn(),
}));
vi.mock("~/services/pdf/footer/createStamp", () => ({
  createStamp: vi.fn(),
}));

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

  it("should create 'Sect' struct for each page (totalPages times)", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const totalPages = 3;
    const mockDoc = mockPdfKitDocument(mockStruct, {
      start: 1,
      count: totalPages,
    });

    createFooter(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledTimes(totalPages);
    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockStruct.add).toHaveBeenCalledTimes(totalPages);
  });
});
