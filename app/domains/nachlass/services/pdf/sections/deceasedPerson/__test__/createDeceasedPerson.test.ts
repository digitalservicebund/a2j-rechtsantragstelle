import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addDeceasedPersonDetails } from "../addDeceasedPersonDetails";
import { addDeceasedPersonLastStay } from "../addDeceasedPersonLastStay";
import { createDeceasedPerson } from "../createDeceasedPerson";

vi.mock("../addDeceasedPersonDetails");
vi.mock("../addDeceasedPersonLastStay");

vi.mocked(addDeceasedPersonDetails).mockImplementation(() => vi.fn());
vi.mocked(addDeceasedPersonLastStay).mockImplementation(() => vi.fn());

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createDeceasedPerson", () => {
  it("should call addDeceasedPersonDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createDeceasedPerson(mockDoc, mockStruct, {});

    expect(addDeceasedPersonDetails).toHaveBeenCalledTimes(1);
  });

  it("should call addDeceasedPersonLastStay", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createDeceasedPerson(mockDoc, mockStruct, {});

    expect(addDeceasedPersonLastStay).toHaveBeenCalledTimes(1);
  });

  it("should create the title", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createDeceasedPerson(mockDoc, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith(
      "I. Verstorbene Person / Erblasser",
      {
        align: "left",
      },
    );
  });
});
