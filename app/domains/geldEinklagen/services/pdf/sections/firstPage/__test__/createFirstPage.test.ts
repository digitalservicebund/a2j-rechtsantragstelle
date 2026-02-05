import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { createFirstPage } from "../createFirstPage";
import { createLocalCourtAndDate } from "~/domains/shared/services/pdf/createLocalCourtAndDate";
import { createStatementClaim } from "../createStatementClaim";
import { createClaimData } from "../claimData/createClaimData";

vi.mock("~/domains/shared/services/pdf/createLocalCourtAndDate");
vi.mock("../claimData/createClaimData");
vi.mock("../createStatementClaim");
vi.mock("../../createPageFooter");

vi.mocked(createLocalCourtAndDate).mockImplementation(() => vi.fn());
vi.mocked(createClaimData).mockImplementation(() => vi.fn());
vi.mocked(createStatementClaim).mockImplementation(() => vi.fn());

describe("createFirstPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call the createLocalCourtAndDate for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct, userDataMock);

    expect(createLocalCourtAndDate).toBeCalledTimes(1);
  });

  it("should call the createClaimData for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct, userDataMock);

    expect(createClaimData).toBeCalledTimes(1);
  });

  it("should call the createStatementClaim for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct, userDataMock);

    expect(createStatementClaim).toBeCalledTimes(1);
  });
});
