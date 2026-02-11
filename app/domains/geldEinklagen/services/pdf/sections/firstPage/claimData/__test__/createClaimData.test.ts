import { type Mock } from "vitest";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { addAccusedDetails } from "../addAccusedDetails";
import { addPlaintiffDetails } from "../addPlaintiffDetails";
import { createClaimData } from "../createClaimData";

vi.mock("../addPlaintiffDetails");
vi.mock("../addAccusedDetails");

vi.mocked(addPlaintiffDetails).mockImplementation(() => vi.fn());
vi.mocked(addAccusedDetails).mockImplementation(() => vi.fn());

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createClaimData", () => {
  it("should create document with title, subtile, in the matter and against texts", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.fontSize).toHaveBeenCalledWith(31);
    expect(mockDoc.text).toHaveBeenCalledWith("Klage", { align: "left" });
    expect(mockDoc.moveDown).toHaveBeenCalled();

    expect(mockDoc.text).toHaveBeenCalledWith(
      "im Online-Verfahren nach Paragraf 1124 Absatz 1 Nummer 1 der Zivilprozessordnung",
    );

    expect(mockDoc.fontSize).toHaveBeenCalledWith(14);
    expect(mockDoc.text).toHaveBeenCalledWith("in der Sache");
    expect(mockDoc.moveDown).toHaveBeenCalled();

    expect(mockDoc.fontSize).toHaveBeenCalledWith(14);
    expect(mockDoc.text).toHaveBeenCalledWith("gegen", { align: "left" });
    expect(mockDoc.moveDown).toHaveBeenCalled();
  });

  it("should call text with due reason and subject area", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.fontSize).toHaveBeenCalledWith(12);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Wegen: Zahlungsklage - Miete & Pacht",
    );
    expect(mockDoc.moveDown).toHaveBeenCalled();
  });

  it("should not have the description of subject area when sachgebiet is anderesRechtsproblem", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWithAnderesRechtsproblem = {
      ...userDataMock,
      sachgebiet: "anderesRechtsproblem" as const,
    };

    createClaimData(mockDoc, mockStruct, userDataWithAnderesRechtsproblem);

    expect(mockDoc.fontSize).toHaveBeenCalledWith(12);
    expect(mockDoc.text).toHaveBeenCalledWith("Wegen: Zahlungsklage ");
    expect(mockDoc.moveDown).toHaveBeenCalled();
  });

  it("should call addPlaintiffDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct, userDataMock);

    expect(addPlaintiffDetails).toBeCalledTimes(1);
  });

  it("should call addAccusedDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct, userDataMock);

    expect(addAccusedDetails).toBeCalledTimes(1);
  });
});

describe("createClaimData - accessibility", () => {
  it("should call createClaimData with one h1", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    createClaimData(mockDoc, mockSect, userDataMock);
    expect(mockDoc.struct).toHaveBeenCalledWith("H1", {}, expect.any(Function));
    const callsWithH1 = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "H1",
    );
    expect(callsWithH1).toHaveLength(1);
  });
  it("should call createClaimData with one h2", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    createClaimData(mockDoc, mockSect, userDataMock);
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));
    const callsWithH2 = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "H2",
    );
    expect(callsWithH2).toHaveLength(1);
  });
  it("should call createClaimData with four paragraphs", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    createClaimData(mockDoc, mockSect, userDataMock);
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(4);
  });
});
