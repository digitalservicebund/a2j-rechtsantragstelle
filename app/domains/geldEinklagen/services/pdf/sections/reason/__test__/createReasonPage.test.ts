import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createReasonPage } from "../createReasonPage";
import { createLegalAssessment } from "../legalAssessment/createLegalAssessment";
import { createFactsOfCase } from "../factsOfCase/createFactsOfCase";

vi.mock("../factsOfCase/createFactsOfCase");
vi.mock("../legalAssessment/createLegalAssessment");

vi.mocked(createFactsOfCase).mockImplementation(() => vi.fn());
vi.mocked(createLegalAssessment).mockImplementation(() => vi.fn());

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createReasonPage", () => {
  it("should add the document the title of the reason section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith("Begründung", {
      align: "left",
    });
  });

  it("should call the createFactsOfCase for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(createFactsOfCase).toHaveBeenCalledTimes(1);
  });

  it("should call the createLegalAssessment for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });
    createReasonPage(mockDoc, mockStruct, {});

    expect(createLegalAssessment).toHaveBeenCalledTimes(1);
  });
});
