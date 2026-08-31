import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { createFactsOfCase } from "../createFactsOfCase";
import { addDocumentsFactsOfCase } from "../addDocumentsFactsOfCase";
import { addWitnessOfCase } from "../addWitnessOfCase";

vi.mock("../addDocumentsFactsOfCase");
vi.mock("../addWitnessOfCase");

vi.mocked(addDocumentsFactsOfCase).mockImplementation(() => vi.fn());
vi.mocked(addWitnessOfCase).mockImplementation(() => vi.fn());

beforeEach(() => {
  vi.clearAllMocks();
});

const userData: GeldEinklagenFormularUserData = {
  abschnitte: [
    {
      beschreibung: "Beschreibung 1",
    },
    {
      beschreibung: "Beschreibung 2",
    },
  ],
};

describe("createFactsOfCase", () => {
  it("should create a title and add the facts of case to the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFactsOfCase(mockDoc, mockStruct, userData);

    expect(mockDoc.text).toHaveBeenCalledWith("I. Sachverhalt");

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Beschreibung 1",
      expect.any(Number),
      undefined,
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Beschreibung 2",
      expect.any(Number),
      undefined,
    );
  });

  it("should call the addDocumentsFactsOfCase", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createFactsOfCase(mockDoc, mockStruct, userData);

    expect(addDocumentsFactsOfCase).toHaveBeenCalledTimes(2);
  });

  it("should call the addWitnessOfCase", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFactsOfCase(mockDoc, mockStruct, userData);

    expect(addWitnessOfCase).toHaveBeenCalledTimes(2);
  });
});
