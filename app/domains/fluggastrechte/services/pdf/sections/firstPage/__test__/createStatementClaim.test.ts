import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList } from "../claimData/addDefendantPartyList";
import {
  createStatementClaim,
  STATEMENT_CLAIM_COURT_SENTENCE,
  STATEMENT_CLAIM_SUBTITLE_TEXT,
  STATEMENT_CLAIM_TITLE_TEXT,
} from "../createStatementClaim";

const STATEMENT_VIDEO_TRIAL_REQUEST =
  "Die Teilnahme an der mündlichen Verhandlung per Video gemäß § 128a ZPO wird beantragt.";
const STATEMENT_VIDEO_TRIAL_CONCERNS =
  "Gegen die Durchführung einer Videoverhandlung bestehen gemäß § 253 Abs. 3 Nr. 4 ZPO Bedenken.";
describe("createStatementClaim", () => {
  beforeEach(() => {
    vi.mock(
      "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim",
    );
    vi.mock("../claimData/addDefendantPartyList");
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
    expect(mockDoc.text).toHaveBeenCalledWith(STATEMENT_CLAIM_SUBTITLE_TEXT);

    expect(addDefendantPartyList).toHaveBeenCalledWith(
      mockDoc,
      mockStruct,
      userDataMock.prozesszinsen,
      600,
    );
  });

  describe("createStatementClaim - versaeumnisurteil logic", () => {
    it("should include court sentence when versaeumnisurteil is yes", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVersaeumnisurteil = {
        ...userDataMock,
        versaeumnisurteil: "yes",
      } satisfies FluggastrechtContext;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVersaeumnisurteil,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        STATEMENT_CLAIM_COURT_SENTENCE,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include court sentence when versaeumnisurteil is no", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithoutVersaeumnisurteil = {
        ...userDataMock,
        versaeumnisurteil: "no",
      } satisfies FluggastrechtContext;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithoutVersaeumnisurteil,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        STATEMENT_CLAIM_COURT_SENTENCE,
        PDF_MARGIN_HORIZONTAL,
      );
    });
  });

  describe("createStatementClaim - videoverhandlung logic", () => {
    it("should include videoverhandlung request sentence when videoverhandlung is yes", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideorverhandlungRequest = {
        ...userDataMock,
        videoverhandlung: "yes",
      } satisfies FluggastrechtContext;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideorverhandlungRequest,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        STATEMENT_VIDEO_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should include the sentence about videoverhandlung concerns when answer is no", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideoTrialConcerns = {
        ...userDataMock,
        videoverhandlung: "no",
      } satisfies FluggastrechtContext;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideoTrialConcerns,
      );

      expect(mockDoc.text).toHaveBeenCalledWith(
        STATEMENT_VIDEO_TRIAL_CONCERNS,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include videoverhandlung concerns if answer is noSpecification", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideoverhandlungNoSpecification = {
        ...userDataMock,
        videoverhandlung: "noSpecification",
      } satisfies FluggastrechtContext;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideoverhandlungNoSpecification,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        STATEMENT_VIDEO_TRIAL_CONCERNS,
        PDF_MARGIN_HORIZONTAL,
      );
    });

    it("should not include videoverhandlung request if answer is noSpecification", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      const userDataMockWithVideoverhandlungNoSpecification = {
        ...userDataMock,
        videoverhandlung: "noSpecification",
      } satisfies FluggastrechtContext;

      createStatementClaim(
        mockDoc,
        mockStruct,
        userDataMockWithVideoverhandlungNoSpecification,
      );

      expect(mockDoc.text).not.toHaveBeenCalledWith(
        STATEMENT_VIDEO_TRIAL_REQUEST,
        PDF_MARGIN_HORIZONTAL,
      );
    });
  });
});
