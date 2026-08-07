import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createReasonPage } from "../createReasonPage";
import { addFactsOfCases } from "../addFactsOfCases";
import { createLegalAssessment } from "../legalAssessment/createLegalAssessment";

vi.mock("../addFactsOfCases");
vi.mock("../legalAssessment/createLegalAssessment");

vi.mocked(addFactsOfCases).mockImplementation(() => vi.fn());
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

  it("should call the addFactsOfCases for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(addFactsOfCases).toBeCalledTimes(1);
    expect(addFactsOfCases).toHaveBeenCalledWith(
      mockDoc,
      expect.anything(),
      expect.anything(),
    );
  });

  it("should call the createLegalAssessment for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });
    createReasonPage(mockDoc, mockStruct, {});

    expect(createLegalAssessment).toHaveBeenCalledTimes(1);
  });

  it("should call createLegalAssessment with false when beweiseBeschreibung is missing", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(createLegalAssessment).toHaveBeenCalledTimes(1);
    expect(createLegalAssessment).toHaveBeenCalledWith(
      mockDoc,
      expect.anything(),
      {},
      false,
    );
  });
});
