import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createFirstPage } from "../createFirstPage";
import { createFlightCompensationClaim } from "../createFlightCompensationClaim";
import { createLocalCourtAndDate } from "../createLocalCourtAndDate";
import { createStatementClaim } from "../createStatementClaim";

vi.mock("../createLocalCourtAndDate");
vi.mock("../createFlightCompensationClaim");
vi.mock("../createStatementClaim");
vi.mock("../../createPageFooter");

vi.mocked(createLocalCourtAndDate).mockImplementation(() => vi.fn());
vi.mocked(createFlightCompensationClaim).mockImplementation(() => vi.fn());
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

  it("should call the createFlightCompensationClaim for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct, userDataMock);

    expect(createFlightCompensationClaim).toBeCalledTimes(1);
  });

  it("should call the createStatementClaim for the creation of the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFirstPage(mockDoc, mockStruct, userDataMock);

    expect(createStatementClaim).toBeCalledTimes(1);
  });
});
