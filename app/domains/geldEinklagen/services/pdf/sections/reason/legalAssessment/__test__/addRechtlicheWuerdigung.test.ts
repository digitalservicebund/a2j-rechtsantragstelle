import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addRechtlicheWuerdigung } from "../addRechtlicheWuerdigung";

describe("addRechtlicheWuerdigung", () => {
  it("should not add rechtlicheWuerdigung if it is not provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addRechtlicheWuerdigung(mockDoc, mockStruct, { rechtlicheWuerdigung: "" });

    expect(mockDoc.struct).not.toHaveBeenCalledWith("Sect");
  });

  it("should add rechtlicheWuerdigung if it is provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const rechtlicheWuerdigungMock = "rechtlicheWuerdigung.";
    addRechtlicheWuerdigung(mockDoc, mockStruct, {
      rechtlicheWuerdigung: rechtlicheWuerdigungMock,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(rechtlicheWuerdigungMock);
  });
});
