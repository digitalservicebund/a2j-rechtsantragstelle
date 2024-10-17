import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { getCompensationPayment } from "~/services/airports/getCompensationPayment";
import {
  createStatementClaim,
  STATEMENT_CLAIM_AGREEMENT_SENTENCE,
  STATEMENT_CLAIM_COURT_SENTENCE,
  STATEMENT_CLAIM_SUBTITLE_TEXT,
  STATEMENT_CLAIM_TITLE_TEXT,
  getDefendantPartyList,
} from "../createStatementClaim";

function assertDefendantPartyList(
  mockDoc: PDFKit.PDFDocument,
  defendantPartyList: Record<string, string>,
) {
  for (const [bullet, claim] of Object.entries(defendantPartyList)) {
    expect(mockDoc.text).toHaveBeenCalledWith(bullet, 80, undefined, {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(claim, { width: 500 });
  }
}

describe("createStatementClaim", () => {
  beforeEach(() => {
    vi.mock("~/services/airports/getCompensationPayment");
    vi.mocked(getCompensationPayment).mockReturnValue("600");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create the document with the statement claim correctly", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_TITLE_TEXT);
    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_SUBTITLE_TEXT);

    const compensation = getCompensationPayment({
      startAirport: userDataMock.startAirport,
      endAirport: userDataMock.endAirport,
    });

    const defendantPartyList = getDefendantPartyList(
      userDataMock.prozesszinsen,
      compensation,
    );

    assertDefendantPartyList(mockDoc, defendantPartyList);

    expect(mockDoc.text).toHaveBeenCalledWith(
      STATEMENT_CLAIM_COURT_SENTENCE,
      70,
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      STATEMENT_CLAIM_AGREEMENT_SENTENCE,
      70,
    );
  });

  it("should create a list structure with list items", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("L");
    expect(mockDoc.struct).toHaveBeenCalledWith("LI", {}, expect.any(Function));

    const defendantPartyList = getDefendantPartyList(
      userDataMock.prozesszinsen,
      "600",
    );
    assertDefendantPartyList(mockDoc, defendantPartyList);
  });
});
