import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";
import {
  CLAIM_FULL_JUSTIFIED_TEXT,
  createLegalAssessment,
  LEGAL_ASSESSMENT_TEXT,
} from "../createLegalAssessment";

vi.mock("../../addNewPageInCaseMissingVerticalSpace");

vi.mocked(addNewPageInCaseMissingVerticalSpace).mockImplementation(() =>
  vi.fn(),
);

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("createLegalAssessment", () => {
  it("should render document with legal assessment text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      LEGAL_ASSESSMENT_TEXT,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should render document with claim full justified text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(CLAIM_FULL_JUSTIFIED_TEXT);
  });

  it("should render document with assumed settlement section text given streitbeilegung yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      ...userDataMock,
      streitbeilegung: "yes",
    } satisfies FluggastrechtContext;

    createLegalAssessment(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung no and streitbeilegungGruende yesAirlineAgainst", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      ...userDataMock,
      streitbeilegung: "no",
      streitbeilegungGruende: "yesAirlineAgainst",
    } satisfies FluggastrechtContext;

    createLegalAssessment(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung no and streitbeilegungGruende no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      ...userDataMock,
      streitbeilegung: "no",
      streitbeilegungGruende: "no",
    } satisfies FluggastrechtContext;

    createLegalAssessment(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung no and streitbeilegungGruende yesOtherReasons", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      ...userDataMock,
      streitbeilegung: "no",
      streitbeilegungGruende: "yesOtherReasons",
    } satisfies FluggastrechtContext;

    createLegalAssessment(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.",
    );
  });

  it("should render document with claim person name", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Herr Test-test Test");
  });

  it("should call function addNewPageInCaseMissingVerticalSpace twice", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(2);
  });
});
