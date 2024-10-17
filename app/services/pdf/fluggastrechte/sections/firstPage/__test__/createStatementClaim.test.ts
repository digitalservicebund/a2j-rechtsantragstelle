import { describe, it, expect, vi, beforeEach } from "vitest";
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

    // Assertions for titles
    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_TITLE_TEXT);
    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_SUBTITLE_TEXT);

    // Compensation calculation
    const compensation = getCompensationPayment({
      startAirport: userDataMock.startAirport,
      endAirport: userDataMock.endAirport,
    });

    const [firstBullet, firstClaim] = Object.entries(
      getDefendantPartyList(userDataMock.prozesszinsen, compensation),
    )[0];
    const [secondBullet, secondClaim] = Object.entries(
      getDefendantPartyList(userDataMock.prozesszinsen, compensation),
    )[1];

    expect(mockDoc.text).toHaveBeenCalledWith(firstBullet, 80, undefined, {
      continued: true,
    });
    expect(firstClaim).toContain("600");
    expect(mockDoc.text).toHaveBeenCalledWith(firstClaim, { width: 500 });
    expect(mockDoc.text).toHaveBeenCalledWith(secondBullet, {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(secondClaim);

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

    // Assert list structure creation
    expect(mockDoc.struct).toHaveBeenCalledWith("L");
    expect(mockDoc.struct).toHaveBeenCalledWith("LI", {}, expect.any(Function));
  });
});
