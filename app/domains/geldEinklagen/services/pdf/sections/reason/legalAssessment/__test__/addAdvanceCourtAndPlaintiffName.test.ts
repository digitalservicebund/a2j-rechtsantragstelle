import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addAdvanceCourtAndPlaintiffName } from "../addAdvanceCourtAndPlaintiffName";

describe("addAdvanceCourtAndPlaintiffName", () => {
  it("should render document with advance court text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAdvanceCourtAndPlaintiffName(mockDoc, mockStruct, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichnen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von 0 Euro anzufordern und die Klage nach der Zahlung schnellstmöglich an die beklagte Partei zuzustellen.",
    );
  });

  it("should render document with plaintiff name", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockData = {
      klagendePersonAnrede: "herr",
      klagendePersonTitle: "dr",
      klagendePersonVorname: "Max",
      klagendePersonNachname: "Mustermann",
    } satisfies GeldEinklagenFormularUserData;

    addAdvanceCourtAndPlaintiffName(mockDoc, mockStruct, mockStruct, mockData);

    expect(mockDoc.text).toHaveBeenCalledWith("Herr Dr. Max Mustermann");
  });
});
