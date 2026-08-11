import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { createAntragstellendePerson } from "~/domains/nachlass/services/pdf/erbschein/sections/antragstellendePerson/createAntragstellendePerson";
import { printRelationshipToDeceased } from "~/domains/nachlass/services/pdf/shared/printRelationshipToDeceased";

const userDataMock = {
  antragstellendePersonVorname: "Max",
  antragstellendePersonNachname: "Mustermann",
  antragstellendePersonGeburtsdatum: {
    day: "01",
    month: "01",
    year: "1990",
  },
  antragstellendePersonStrasse: "Beispielstraße",
  antragstellendePersonHausnummer: "1",
  antragstellendePersonPlz: "12345",
  antragstellendePersonOrt: "Beispielstadt",
  antragstellendePersonRelationshipToErblasser: "cousin",
} satisfies NachlassErbscheinAnfrageUserData;

describe("createAntragstellendePerson", () => {
  it("should add the antragstellende Person's details to the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createAntragstellendePerson(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Vornamen: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Max");
    expect(mockDoc.text).toHaveBeenCalledWith("Nachname: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsname: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsdatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.1990");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Familienverhältnis zum Erblasser: ",
      {
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      printRelationshipToDeceased(
        userDataMock.antragstellendePersonRelationshipToErblasser,
      ),
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Anschrift: ");
    expect(mockDoc.text).toHaveBeenCalledWith("Beispielstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("12345 Beispielstadt");
  });
});
