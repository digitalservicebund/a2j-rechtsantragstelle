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

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_TITLE_TEXT);

    expect(addDefendantPartyList).toHaveBeenCalledWith(
      mockDoc,
      mockStruct,
      userDataMock.prozesszinsen,
      600,
    );
  });

  describe("createStatementClaim - versaeumnisurteil logic", () => {
    it("should include online court sentence and title when versaeumnisurteil is yes", () => {
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
    it("should include videoverhandlung request sentence when answer is yes", () => {
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
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        ONLINE_STATEMENT_VIDEO_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should include the sentence about videoverhandlung concerns when answer is no", () => {
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
    it("should include oral hearing sentence when muendlicheVerhandlung is yes", () => {
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

      createStatementClaim(mockDoc, mockStruct, userDataMock);
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

    it("should call the createStatementClaim with one H3 when negotiation content is visible", () => {
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

    it("should render Mündliche Verhandlung before Versäumnisurteil when both are visible", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithBoth = {
        ...userDataMock,
        versaeumnisurteil: "yes",
        muendlicheVerhandlung: "yes",
        videoverhandlung: "yes",
      } satisfies FluggastrechteUserData;

      createStatementClaim(mockDoc, mockStruct, userDataMockWithBoth);

      const called = (mockDoc.text as Mock).mock.calls.filter(
        ([txt]) =>
          txt === STATEMENT_NEGOTIATION_TITLE_TEXT ||
          txt === STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT,
      );

      expect(called).toEqual([
        [STATEMENT_NEGOTIATION_TITLE_TEXT, PDF_MARGIN_HORIZONTAL],
        [STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT, PDF_MARGIN_HORIZONTAL],
      ]);
      expect(called).not.toEqual([
        [STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT, PDF_MARGIN_HORIZONTAL],
        [STATEMENT_NEGOTIATION_TITLE_TEXT, PDF_MARGIN_HORIZONTAL],
      ]);
    });
  });
});
