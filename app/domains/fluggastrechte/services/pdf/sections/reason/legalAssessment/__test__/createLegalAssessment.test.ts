import { type Mock } from "vitest";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  createLegalAssessment,
  LEGAL_ASSESSMENT_TEXT,
} from "../createLegalAssessment";
import { addDisputeResolution } from "~/domains/shared/services/pdf/addDisputeResolution";

vi.mock("~/services/pdf/addNewPageInCaseMissingVerticalSpace");
vi.mock("~/domains/shared/services/pdf/addDisputeResolution");

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

  it("should call the addDisputeResolution for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(addDisputeResolution).toHaveBeenCalledTimes(1);
  });

  it("should render document with claim person name", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Herr Test-test Test");
  });

  it("should call function addNewPageInCaseMissingVerticalSpace once", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(addNewPageInCaseMissingVerticalSpace).toHaveBeenCalledOnce();
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
    expect(callsWithP).toHaveLength(2);
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
