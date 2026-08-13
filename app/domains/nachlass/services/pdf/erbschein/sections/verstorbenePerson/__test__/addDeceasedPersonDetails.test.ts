import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addDeceasedPersonDetails } from "../addDeceasedPersonDetails";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const userDataMock = {
  verstorbeneVorname: "Max",
  verstorbeneNachname: "Mustermann",
  verstorbeneStaatsangehoerigkeit: "Deutsch",
  verstorbeneGeburtsdatum: { day: "01", month: "01", year: "1990" },
  verstorbeneGeburtsort: "Musterstadt",
  sterbedatum: { day: "01", month: "01", year: "2020" },
  sterbeort: "Musterstadt",
  verstorbeneFamilienstand: "ledig",
} satisfies NachlassErbscheinAnfrageUserData;

describe("addDeceasedPersonDetails", () => {
  it("should add the deceased person details to the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonDetails(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Vornamen: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Max");
    expect(mockDoc.text).toHaveBeenCalledWith("Nachname: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Sterbedatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.2020");
    expect(mockDoc.text).toHaveBeenCalledWith("Sterbeort: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstadt");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsdatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.1990");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsort: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstadt");
    expect(mockDoc.text).toHaveBeenCalledWith("Familienstand: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Ledig");
  });

  it("should add birth name if it provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonDetails(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneGeburtsname: "Musterfrau",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsname: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Musterfrau");
  });

  it("should call surname twice if birth name is not provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const textSpy = vi.spyOn(mockDoc, "text");

    addDeceasedPersonDetails(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneGeburtsname: "",
    });

    const mustermannCalls = textSpy.mock.calls.filter(
      ([firstArg]) => firstArg === "Mustermann",
    );

    expect(mustermannCalls).toHaveLength(2);
  });

  it("should add Staatsangehörigkeit(en) if provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonDetails(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneHadSecondNationality: "yes",
      verstorbeneZweiteStaatsangehoerigkeit: "Französisch",
      verstorbeneHadThirdNationality: "yes",
      verstorbeneDritteStaatsangehoerigkeit: "Nederlandisch",
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Deutsch, Französisch, Nederlandisch",
    );
  });
});
