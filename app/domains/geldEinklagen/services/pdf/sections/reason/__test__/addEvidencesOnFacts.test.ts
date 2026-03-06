import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addEvidencesOnFacts } from "../addEvidencesOnFacts";

describe("addEvidencesOnFacts", () => {
  it("should add heading and evidence text when beweiseBeschreibung exists", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addEvidencesOnFacts(mockDoc, mockStruct, "Mein Beweistext");

    expect(mockDoc.text).toHaveBeenCalledWith("II. Beweise zum Sachverhalt");
    expect(mockDoc.text).toHaveBeenCalledWith("Mein Beweistext");
  });

  it("should not add heading or text when beweiseBeschreibung is missing", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addEvidencesOnFacts(mockDoc, mockStruct, "");

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "II. Beweise zum Sachverhalt",
    );
    expect(mockDoc.text).not.toHaveBeenCalled();
  });
});
