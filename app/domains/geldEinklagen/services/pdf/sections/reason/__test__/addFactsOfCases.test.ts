import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addFactsOfCases } from "../addFactsOfCases";

describe("addFactsOfCases", () => {
  it("should add heading and sachverhaltBegruendung text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFactsOfCases(mockDoc, mockStruct, "Das ist meine Begründung.");

    expect(mockDoc.text).toHaveBeenCalledWith("I. Sachverhalt");
    expect(mockDoc.text).toHaveBeenCalledWith("Das ist meine Begründung.");
  });

  it("should not add sachverhaltBegruendung paragraph when text is missing", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFactsOfCases(mockDoc, mockStruct, "");

    expect(mockDoc.text).toHaveBeenCalledWith("I. Sachverhalt");
    expect(mockDoc.text).not.toHaveBeenCalledWith("Das ist meine Begründung.");
  });
});
