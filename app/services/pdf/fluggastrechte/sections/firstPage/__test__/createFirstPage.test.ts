import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createPageFooter } from "../../createPageFooter";
import { createClaimData } from "../claimData/createClaimData";
import { createFirstPage } from "../createFirstPage";
import { createLocalCourtAndDate } from "../createLocalCourtAndDate";
import { createMainTitle } from "../createMainTitle";
import { createStatementClaim } from "../createStatementClaim";

vi.mock("../claimData/createClaimData");
vi.mock("../createLocalCourtAndDate");
vi.mock("../createMainTitle");
vi.mock("../createStatementClaim");
vi.mock("../../createPageFooter");

vi.mocked(createLocalCourtAndDate).mockImplementation(() => vi.fn());
vi.mocked(createMainTitle).mockImplementation(() => vi.fn());
vi.mocked(createClaimData).mockImplementation(() => vi.fn());
vi.mocked(createStatementClaim).mockImplementation(() => vi.fn());
vi.mocked(createPageFooter).mockImplementation(() => vi.fn());

describe("createFirstPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call the createLocalCourtAndDate for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct);

    expect(createLocalCourtAndDate).toBeCalledTimes(1);
  });

  it("should call the createClaimData for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct);

    expect(createClaimData).toBeCalledTimes(1);
  });

  it("should call the createMainTitle for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct);

    expect(createMainTitle).toBeCalledTimes(1);
  });

  it("should call the createStatementClaim for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct);

    expect(createStatementClaim).toBeCalledTimes(1);
  });

  it("should call the createPageFooter for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct);

    expect(createPageFooter).toBeCalledTimes(1);
    expect(createPageFooter).toBeCalledWith(mockDoc, mockStruct);
  });
});
