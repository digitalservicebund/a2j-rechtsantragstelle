import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { createAngehoerigeSection } from "~/domains/nachlass/services/pdf/erbschein/sections/angehoerige/createAngehoerigeSection";

describe("createAngehoerigeSection", () => {
  it("Should enumerate all first-order descendants in the PDF", () => {
    const userDataMock: NachlassErbscheinAnfrageUserData = {
      kinder: [
        {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: { day: "01", month: "01", year: "1980" },
          geburtsort: "Berlin",
          isAlive: "no",
          sterbedatum: { day: "01", month: "01", year: "2020" },
          sterbeort: "Berlin",
          hatteKinder: "yes",
          kinder: [
            {
              vorname: "Erika",
              nachname: "Mustermann",
              geburtsdatum: { day: "01", month: "01", year: "1991" },
              geburtsort: "Köln",
              isAlive: "no",
              sterbedatum: { day: "01", month: "01", year: "2020" },
              sterbeort: "Berlin",
              hatteKinder: "yes",
              kinder: [
                {
                  vorname: "Lukas",
                  nachname: "Mustermann",
                  geburtsdatum: { day: "01", month: "01", year: "2010" },
                  geburtsort: "Hamburg",
                  isAlive: "yes",
                  strasse: "Hauptstraße",
                  hausnummer: "123",
                  plz: "10115",
                  ort: "Berlin",
                  land: "Deutschland",
                },
              ],
            },
          ],
        },
        {
          vorname: "Gisela",
          nachname: "Mustermann",
          geburtsdatum: { day: "01", month: "01", year: "1995" },
          geburtsort: "München",
          isAlive: "yes",
          strasse: "Hauptstraße",
          hausnummer: "123",
          plz: "10115",
          ort: "Berlin",
          land: "Deutschland",
        },
      ],
    };
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createAngehoerigeSection(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Max Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Kind");
    expect(mockDoc.text).toHaveBeenCalledWith("Erika Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Enkelkind");
    expect(mockDoc.text).toHaveBeenCalledWith("Lukas Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Urenkel");
    expect(mockDoc.text).toHaveBeenCalledWith("Gisela Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Kind");
  });

  it("Should enumerate each additional Angehoerige in the PDF", () => {
    const userDataMock: NachlassErbscheinAnfrageUserData = {
      angehoerige: [
        {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: { day: "01", month: "01", year: "1980" },
          geburtsort: "Berlin",
          verhaeltnis: "life-partner",
          strasse: "Hauptstraße",
          hausnummer: "123",
          plz: "10115",
          ort: "Berlin",
          land: "Deutschland",
          isAlive: "yes",
        },
        {
          vorname: "Erika",
          nachname: "Mustermann",
          isAlive: "no",
          geburtsdatum: { day: "01", month: "01", year: "1991" },
          geburtsort: "Köln",
          sterbedatum: { day: "01", month: "01", year: "2020" },
          sterbeort: "Berlin",
        },
      ],
    };
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createAngehoerigeSection(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.text).toHaveBeenCalledWith("Max Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsdatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.1980");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsort: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Berlin");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Familienverhältnis zum Erblasser: ",
      { continued: true },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Lebenspartner*in");
    expect(mockDoc.text).toHaveBeenCalledWith("Anschrift: ");
    expect(mockDoc.text).toHaveBeenCalledWith("Hauptstraße 123");
    expect(mockDoc.text).toHaveBeenCalledWith("10115 Berlin");
    expect(mockDoc.text).toHaveBeenCalledWith("Deutschland");

    expect(mockDoc.text).toHaveBeenCalledWith("Erika Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsdatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.1991");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsort: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Köln");
    expect(mockDoc.text).toHaveBeenCalledWith("Sterbedatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.2020");
    expect(mockDoc.text).toHaveBeenCalledWith("Sterbeort: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Berlin");
  });
});
