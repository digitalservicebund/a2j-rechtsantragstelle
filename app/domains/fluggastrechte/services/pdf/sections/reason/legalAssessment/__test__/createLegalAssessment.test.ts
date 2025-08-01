import { type Mock } from "vitest";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
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
    } satisfies FluggastrechteUserData;

    createLegalAssessment(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung no and streitbeilegungGruende yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      ...userDataMock,
      streitbeilegung: "no",
      streitbeilegungGruende: "yes",
    } satisfies FluggastrechteUserData;

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
    } satisfies FluggastrechteUserData;

    createLegalAssessment(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung no and streitbeilegungGruende noSpecification", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      ...userDataMock,
      streitbeilegung: "no",
      streitbeilegungGruende: "noSpecification",
    } satisfies FluggastrechteUserData;

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

describe("createLegalAssessment - accessibility", () => {
  it("should call createLegalAssessment with one paragraph", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock);
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(3);
  });

  it("should call createLegalAssessment with one h3", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock);
    expect(mockDoc.struct).toHaveBeenCalledWith("H3", {}, expect.any(Function));
    const callsWithH3 = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "H3",
    );
    expect(callsWithH3).toHaveLength(1);
  });
});
