import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createReasonPage } from "../createReasonPage";
import { addFactsOfCases } from "../addFactsOfCases";
import { addEvidencesOnFacts } from "../addEvidencesOnFacts";
import { createLegalAssessment } from "../legalAssessment/createLegalAssessment";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

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
    const userData = { sachverhaltBegruendung: "Mein Sachverhalt" };

    createReasonPage(mockDoc, mockStruct, userData);

    expect(addFactsOfCases).toBeCalledTimes(1);
    expect(addFactsOfCases).toHaveBeenCalledWith(
      mockDoc,
      expect.anything(),
      userData.sachverhaltBegruendung,
    );
  });

  it("should call the addEvidencesOnFacts for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });
    const userData: GeldEinklagenFormularUserData = {
      beweiseAngebot: "yes",
      beweiseBeschreibung: "Mein Beweistext",
    };

    createReasonPage(mockDoc, mockStruct, userData);

    expect(addEvidencesOnFacts).toBeCalledTimes(1);
    expect(addEvidencesOnFacts).toHaveBeenCalledWith(
      mockDoc,
      expect.anything(),
      userData.beweiseBeschreibung,
    );
  });

  it("should call the createLegalAssessment for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });
    const userData: GeldEinklagenFormularUserData = {
      beweiseAngebot: "yes",
      beweiseBeschreibung: "Mein Beweistext",
    };

    createReasonPage(mockDoc, mockStruct, userData);

    expect(createLegalAssessment).toBeCalledTimes(1);
    expect(createLegalAssessment).toHaveBeenCalledWith(
      mockDoc,
      expect.anything(),
      userData,
      true,
    );
  });

  it("should call createLegalAssessment with false when beweiseBeschreibung is missing", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 2, count: 2 });

    createReasonPage(mockDoc, mockStruct, {});

    expect(createLegalAssessment).toBeCalledTimes(1);
    expect(createLegalAssessment).toHaveBeenCalledWith(
      mockDoc,
      expect.anything(),
      {},
      false,
    );
  });
});
