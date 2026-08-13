import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { createEhepartner } from "~/domains/nachlass/services/pdf/erbschein/sections/ehepartner/createEhepartner";

const userDataMock: NachlassErbscheinAnfrageUserData = {
  ehepartnerVorname: "Maria",
  ehepartnerNachname: "Mustermann",
};

describe("createEhepartner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should print basic spousal data", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createEhepartner(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.text).toHaveBeenCalledWith("Vornamen: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Maria");
    expect(mockDoc.text).toHaveBeenCalledWith("Nachname: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsname: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Mustermann");
  });

  it("should print Sterbedatum and Sterbeort, if the Erblasser was a widow/widower", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createEhepartner(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneFamilienstand: "verwitwet",
      spouseSterbedatum: {
        day: "01",
        month: "01",
        year: "1980",
      },
      spouseSterbeort: "Berlin",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Sterbedatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.1980");
    expect(mockDoc.text).toHaveBeenCalledWith("Sterbeort: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Berlin");
  });

  it("should skip Sterbedatum and Sterbeort if the Erblasser was NOT a widow/widower", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createEhepartner(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneFamilienstand: "verheiratet",
      spouseSterbedatum: {
        day: "01",
        month: "01",
        year: "1980",
      },
      spouseSterbeort: "Berlin",
    });

    expect(mockDoc.text).not.toHaveBeenCalledWith("Sterbedatum: ", {
      continued: true,
    });
    expect(mockDoc.text).not.toHaveBeenCalledWith("Sterbeort: ", {
      continued: true,
    });
  });

  it("should indicate that the Ehepartner shares an address with the Erblasser if true", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createEhepartner(mockDoc, mockStruct, {
      ...userDataMock,
      spouseHasSameAddress: "yes",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Anschrift: ");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Entspricht der Adresse des Erblassers",
    );
  });

  it("should print the Ehepartner's address when different from Erblasser", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createEhepartner(mockDoc, mockStruct, {
      ...userDataMock,
      spouseHasSameAddress: "no",
      ehepartnerAdresszusatz: "bei C/O",
      ehepartnerStrasse: "Musterstrasse",
      ehepartnerHausnummer: "1",
      ehepartnerPlz: "10557",
      ehepartnerOrt: "Berlin",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Anschrift: ");
    expect(mockDoc.text).toHaveBeenCalledWith("bei C/O");
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstrasse 1");
    expect(mockDoc.text).toHaveBeenCalledWith("10557 Berlin");
  });

  it("should print nationality information", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createEhepartner(mockDoc, mockStruct, {
      ...userDataMock,
      ehepartnerStaatsangehoerigkeit: "Neuseeländisch",
      ehepartnerHadSecondNationality: "yes",
      ehepartnerZweiteStaatsangehoerigkeit: "Amerikanisch",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Staatsangehörigkeit(en): ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Neuseeländisch, Amerikanisch");
  });
});
