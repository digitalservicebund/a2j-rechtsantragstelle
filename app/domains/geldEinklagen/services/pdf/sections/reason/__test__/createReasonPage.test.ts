import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createReasonPage } from "../createReasonPage";
import { addFactsOfCases } from "../addFactsOfCases";
import { addEvidencesOnFacts } from "../addEvidencesOnFacts";
import { createLegalAssessment } from "../legalAssessment/createLegalAssessment";

vi.mock("../addFactsOfCases");
vi.mock("../addEvidencesOnFacts");
vi.mock("../legalAssessment/createLegalAssessment");

vi.mocked(addFactsOfCases).mockImplementation(() => vi.fn());
vi.mocked(addEvidencesOnFacts).mockImplementation(() => vi.fn());
vi.mocked(createLegalAssessment).mockImplementation(() => vi.fn());

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createReasonPage", () => {
  it("should add a new page if the document is on the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 1, count: 1 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(mockDoc.addPage).toHaveBeenCalled();
  });

  it("should not add a new page if the document is not on the first page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(mockDoc.addPage).not.toHaveBeenCalled();
  });

  it("should add the document the title of the reason section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith("Begründung", {
      align: "left",
    });
  });

  it("should call the addFactsOfCases for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(addFactsOfCases).toBeCalledTimes(1);
  });

  it("should call the addEvidencesOnFacts for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(addEvidencesOnFacts).toBeCalledTimes(1);
  });

  it("should call the createLegalAssessment for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(createLegalAssessment).toBeCalledTimes(1);
  });
});
