import { type Mock } from "vitest";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList } from "../claimData/addDefendantPartyList";
import {
  createStatementClaim,
  STATEMENT_CLAIM_COURT_SENTENCE,
  ONLINE_STATEMENT_CLAIM_COURT_SENTENCE,
  STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT,
  STATEMENT_NEGOTIATION_TITLE_TEXT,
  STATEMENT_CLAIM_TITLE_TEXT,
} from "../createStatementClaim";

const LEGACY_STATEMENT_VIDEO_TRIAL_REQUEST =
  "Die Teilnahme an der mündlichen Verhandlung per Video gemäß § 128a ZPO wird beantragt.";
const LEGACY_STATEMENT_VIDEO_TRIAL_CONCERNS =
  "Gegen die Durchführung einer Videoverhandlung bestehen gemäß § 253 Abs. 3 Nr. 4 ZPO Bedenken.";
const ONLINE_STATEMENT_ORAL_TRIAL_REQUEST =
  "Es wird beantragt, eine mündliche Verhandlung gemäß §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen.";
const ONLINE_STATEMENT_VIDEO_TRIAL_REQUEST =
  "Die Teilnahme an einer mündlichen Verhandlung per Video gemäß §§ 1127 Absatz 3, 128a ZPO wird beantragt.";
const ONLINE_STATEMENT_VIDEO_TRIAL_CONCERNS =
  "Gegen die Durchführung einer Verhandlung per Video bestehen gemäß § 253 Absatz 3 Nr. 4 ZPO Bedenken.";

vi.mock("~/domains/fluggastrechte/formular/services/getTotalCompensationClaim");
vi.mock("../claimData/addDefendantPartyList");

describe("createStatementClaim", () => {
  beforeEach(() => {
    vi.mocked(getTotalCompensationClaim).mockReturnValue(600);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create the document with the statement claim correctly", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock, true);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_TITLE_TEXT);

    expect(addDefendantPartyList).toHaveBeenCalledWith(
      mockDoc,
      mockStruct,
      userDataMock.prozesszinsen,
      600,
      true,
    );
  });

  describe("createStatementClaim - versaeumnisurteil logic", () => {
    it("should include online court sentence and title when versaeumnisurteil is yes and feature flag is enabled", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVersaeumnisurteil = {
        ...userDataMock,
        versaeumnisurteil: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVersaeumnisurteil,
        true,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        ONLINE_STATEMENT_CLAIM_COURT_SENTENCE,
        PDF_MARGIN_HORIZONTAL,
      );
      expect(mockDoc.text).toHaveBeenCalledWith(
        STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should include legacy court sentence and no title when versaeumnisurteil is yes and feature flag is disabled", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVersaeumnisurteil = {
        ...userDataMock,
        versaeumnisurteil: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVersaeumnisurteil,
        false,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        STATEMENT_CLAIM_COURT_SENTENCE,
        PDF_MARGIN_HORIZONTAL,
      );
      expect(mockDoc.text).not.toHaveBeenCalledWith(
        STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include court sentence when versaeumnisurteil is no", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithoutVersaeumnisurteil = {
        ...userDataMock,
        versaeumnisurteil: "no",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithoutVersaeumnisurteil,
        true,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        STATEMENT_CLAIM_COURT_SENTENCE,
        PDF_MARGIN_HORIZONTAL,
      );
      expect(mockDoc.text).not.toHaveBeenCalledWith(
        ONLINE_STATEMENT_CLAIM_COURT_SENTENCE,
        PDF_MARGIN_HORIZONTAL,
      );
      expect(mockDoc.text).not.toHaveBeenCalledWith(
        STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT,
        PDF_MARGIN_HORIZONTAL,
      );
    });
  });

  describe("createStatementClaim - videoverhandlung logic", () => {
    it("should include legacy videoverhandlung request sentence when feature flag is disabled and videoverhandlung is yes", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideorverhandlungRequest = {
        ...userDataMock,
        videoverhandlung: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideorverhandlungRequest,
        false,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        LEGACY_STATEMENT_VIDEO_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should include legacy videoverhandlung concerns sentence when feature flag is disabled and answer is no", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideoTrialConcerns = {
        ...userDataMock,
        videoverhandlung: "no",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideoTrialConcerns,
        false,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        LEGACY_STATEMENT_VIDEO_TRIAL_CONCERNS,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include legacy videoverhandlung text when feature flag is disabled and answer is noSpecification", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideoverhandlungNoSpecification = {
        ...userDataMock,
        videoverhandlung: "noSpecification",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideoverhandlungNoSpecification,
        false,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        LEGACY_STATEMENT_VIDEO_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
      expect(mockDoc.text).not.toHaveBeenCalledWith(
        LEGACY_STATEMENT_VIDEO_TRIAL_CONCERNS,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should include videoverhandlung request sentence when feature flag is enabled and answer is yes", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideoTrialRequest = {
        ...userDataMock,
        videoverhandlung: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideoTrialRequest,
        true,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        ONLINE_STATEMENT_VIDEO_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should include the sentence about videoverhandlung concerns when feature flag is enabled and answer is no", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideoTrialConcerns = {
        ...userDataMock,
        videoverhandlung: "no",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideoTrialConcerns,
        true,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        ONLINE_STATEMENT_VIDEO_TRIAL_CONCERNS,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include videoverhandlung concerns if answer is noSpecification", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideoverhandlungNoSpecification = {
        ...userDataMock,
        videoverhandlung: "noSpecification",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideoverhandlungNoSpecification,
        true,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        ONLINE_STATEMENT_VIDEO_TRIAL_CONCERNS,
        PDF_MARGIN_HORIZONTAL,
      );
      expect(mockDoc.text).not.toHaveBeenCalledWith(
        ONLINE_STATEMENT_VIDEO_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });
  });

  describe("createStatementClaim - muendliche verhandlung logic", () => {
    it("should include oral hearing sentence when feature flag is enabled and muendlicheVerhandlung is yes", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithMuendlicheVerhandlung = {
        ...userDataMock,
        muendlicheVerhandlung: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithMuendlicheVerhandlung,
        true,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        ONLINE_STATEMENT_ORAL_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include oral hearing sentence when muendlicheVerhandlung is no", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithoutMuendlicheVerhandlung = {
        ...userDataMock,
        muendlicheVerhandlung: "no",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithoutMuendlicheVerhandlung,
        true,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        ONLINE_STATEMENT_ORAL_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include oral hearing sentence when muendlicheVerhandlung is noSpecification", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithoutMuendlicheVerhandlung = {
        ...userDataMock,
        muendlicheVerhandlung: "noSpecification",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithoutMuendlicheVerhandlung,
        true,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        ONLINE_STATEMENT_ORAL_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });
  });

  describe("createStatementClaim - negotiation title logic", () => {
    it("should include Mündliche Verhandlung title when content from muendliche-verhandlung or videoverhandlung is visible", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithNegotiationContent = {
        ...userDataMock,
        versaeumnisurteil: "no",
        muendlicheVerhandlung: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithNegotiationContent,
        true,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        STATEMENT_NEGOTIATION_TITLE_TEXT,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include Mündliche Verhandlung title when no negotiation content is visible", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithoutNegotiationContent = {
        ...userDataMock,
        versaeumnisurteil: "no",
        muendlicheVerhandlung: "noSpecification",
        videoverhandlung: "noSpecification",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithoutNegotiationContent,
        true,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        STATEMENT_NEGOTIATION_TITLE_TEXT,
      );
    });

    it("should not include Mündliche Verhandlung title when feature flag is disabled", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithNegotiationContent = {
        ...userDataMock,
        versaeumnisurteil: "no",
        videoverhandlung: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithNegotiationContent,
        false,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        STATEMENT_NEGOTIATION_TITLE_TEXT,
      );
    });
  });

  describe("createStatementClaim - accessibility", () => {
    it("should call the createStatementClaim with one H2", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      createStatementClaim(mockDoc, mockStruct, userDataMock, true);
      expect(mockDoc.struct).toHaveBeenCalledWith(
        "H2",
        {},
        expect.any(Function),
      );
      const callsWithH2 = (mockDoc.struct as Mock).mock.calls.filter(
        ([tag]) => tag === "H2",
      );
      expect(callsWithH2).toHaveLength(1);
    });

    it("should call the createStatementClaim with one H3 when negotiation content is visible and feature flag is enabled", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithNegotiationContent = {
        ...userDataMock,
        versaeumnisurteil: "no",
        videoverhandlung: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithNegotiationContent,
        true,
      );

      const callsWithH3 = (mockDoc.struct as Mock).mock.calls.filter(
        ([tag]) => tag === "H3",
      );

      expect(mockDoc.struct).toHaveBeenCalledWith(
        "H3",
        {},
        expect.any(Function),
      );
      expect(callsWithH3).toHaveLength(1);
    });

    it("should call the createStatementClaim with two paragraphs if negotiation and versaeumnisurteil content are visible", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithNegotiationAndDefaultJudgment = {
        ...userDataMock,
        versaeumnisurteil: "yes",
        videoverhandlung: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithNegotiationAndDefaultJudgment,
        true,
      );
      const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
        ([tag]) => tag === "P",
      );
      expect(mockDoc.struct).toHaveBeenCalledWith(
        "P",
        {},
        expect.any(Function),
      );
      expect(callsWithP).toHaveLength(2);
    });

    it("should call the createStatementClaim with no paragraphs if videoverhandlung is no specification and versaeumnisurteil is no", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockNoVideoverhandlungNoVersaeumnisurteil = {
        ...userDataMock,
        videoverhandlung: "noSpecification",
        versaeumnisurteil: "no",
      } satisfies FluggastrechteUserData;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockNoVideoverhandlungNoVersaeumnisurteil,
        true,
      );
      const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
        ([tag]) => tag === "P",
      );
      expect(mockDoc.struct).not.toHaveBeenCalledWith(
        "P",
        {},
        expect.any(Function),
      );
      expect(callsWithP).toHaveLength(0);
    });
  });
});
