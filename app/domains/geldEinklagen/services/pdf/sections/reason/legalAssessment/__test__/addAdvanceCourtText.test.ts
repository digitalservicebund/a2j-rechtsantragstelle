import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addAdvanceCourtText } from "../addAdvanceCourtText";

describe("addAdvanceCourtText", () => {
  it("should render document with advance court text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAdvanceCourtText(mockDoc, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von 0 Euro anzufordern und die Klage nach der Zahlung an die beklagte Partei zuzustellen.",
    );
  });
});
