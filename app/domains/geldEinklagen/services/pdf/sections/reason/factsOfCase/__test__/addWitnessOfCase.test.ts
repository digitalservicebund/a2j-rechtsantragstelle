import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addWitnessOfCase } from "../addWitnessOfCase";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

describe("addWitnessOfCase", () => {
  it("should add beklagte as witness to the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const persons: Exclude<
      GeldEinklagenFormularUserData["abschnitte"],
      undefined
    >[number]["personen"] = [
      {
        personAuswahl: "beklagte",
      },
    ];

    addWitnessOfCase(mockDoc, mockStruct, persons);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Beweis angeboten durch Parteivernehmung der folgenden Personen:",
      expect.any(Number),
      undefined,
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Beklagte Person");
  });

  it("should add klagende as witness to the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const persons: Exclude<
      GeldEinklagenFormularUserData["abschnitte"],
      undefined
    >[number]["personen"] = [
      {
        personAuswahl: "klagende",
      },
    ];

    addWitnessOfCase(mockDoc, mockStruct, persons);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Beweis angeboten durch Parteivernehmung der folgenden Personen:",
      expect.any(Number),
      undefined,
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Klagende Person");
  });

  it("should add anotherPerson as witness to the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const persons: Exclude<
      GeldEinklagenFormularUserData["abschnitte"],
      undefined
    >[number]["personen"] = [
      {
        personAuswahl: "anotherPerson",
        anrede: "herr",
        title: "Dr.",
        vorname: "Max",
        nachname: "Mustermann",
        strasse: "Musterstraße",
        hausnummer: "1",
        plz: "12345",
        ort: "Musterstadt",
        land: "Deutschland",
        telefonnummer: "0123456789",
        email: "max.mustermann@example.com",
      },
    ];

    addWitnessOfCase(mockDoc, mockStruct, persons);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Beweis angeboten durch Vernehmung der folgenden Personen als Zeugen oder Zeuginnen:",
      expect.any(Number),
      undefined,
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Herr Dr. Max Mustermann ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Musterstraße 1, 12345 Musterstadt, Deutschland",
      { continued: true },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(", 0123456789", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(", max.mustermann@example.com", {
      continued: false,
    });
  });
});
