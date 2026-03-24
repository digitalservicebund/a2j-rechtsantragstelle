import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addSignature } from "../addSignature";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";

describe("addSignature", () => {
  it("should render signature with plaintiff name when there is no legal representation", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataNoLegalRepresentation: GeldEinklagenFormularUserData = {
      anwaltschaft: "no",
      klagendePersonAnrede: "frau",
      klagendePersonTitle: "dr",
      klagendePersonVorname: "Anna",
      klagendePersonNachname: "Muster",
    };

    addSignature(mockDoc, mockStruct, mockDataNoLegalRepresentation);

    expect(mockDoc.text).toHaveBeenCalledWith("Frau Dr. Anna Muster");
  });

  it("should render signature with legal representative name and profession when there is legal representation", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataLegalRepresentation: GeldEinklagenFormularUserData = {
      anwaltschaft: "yes",
      klagendePersonAnwaltschaftAnrede: "herr",
      klagendePersonAnwaltschaftTitle: "Prof. Dr.",
      klagendePersonAnwaltschaftVorname: "Max",
      klagendePersonAnwaltschaftNachname: "Mustermann",
      klagendePersonAnwaltschaftBerufsbezeichnung: "Rechtsanwalt",
    };

    addSignature(mockDoc, mockStruct, mockDataLegalRepresentation);

    expect(mockDoc.text).toHaveBeenCalledWith("Herr Prof. Dr. Max Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("(Rechtsanwalt)");
  });
});
