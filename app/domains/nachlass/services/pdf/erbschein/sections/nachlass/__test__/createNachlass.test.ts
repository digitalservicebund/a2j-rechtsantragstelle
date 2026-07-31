import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { createNachlass } from "~/domains/nachlass/services/pdf/erbschein/sections/nachlass/createNachlass";

const userDataMock: NachlassErbscheinAnfrageUserData = {
  verstorbeneLebensmittelpunkt: "deutschland",
  hasUnternehmen: "no",
  hasVermoegen: "no",
};

describe("createNachass", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should print basic Nachlass data", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createNachlass(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.text).toHaveBeenCalledWith("Unternehmen im Nachlass: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Nein");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Auslandsvermögen im Nachlass: ",
      {
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Nein");
  });

  it("should print all companies involved in the Nachlass, if indicated", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createNachlass(mockDoc, mockStruct, {
      ...userDataMock,
      hasUnternehmen: "yes",
      unternehmen: [
        {
          firmenname: "Firma 1",
        },
        {
          firmenname: "Firma 2",
        },
      ],
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Unternehmensname(n): ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Firma 1, Firma 2");
  });

  it("should print all Grundbesitz involved in the Nachlass, if indicated", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createNachlass(mockDoc, mockStruct, {
      ...userDataMock,
      hasGrundbesitz: "yes",
      grundbesitz: [
        {
          strasse: "Musterstraße",
          hausnummer: "1",
          plz: "12345",
          ort: "Musterstadt",
        },
        {
          strasse: "Beispielweg",
          hausnummer: "2",
          plz: "54321",
          ort: "Beispielstadt",
        },
      ],
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Grundbesitz im Nachlass: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Ja");
    expect(mockDoc.text).toHaveBeenCalledWith("Grundbesitz 1");
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("12345 Musterstadt");
    expect(mockDoc.text).toHaveBeenCalledWith("Deutschland");
    expect(mockDoc.text).toHaveBeenCalledWith("Grundbesitz 2");
    expect(mockDoc.text).toHaveBeenCalledWith("Beispielweg 2");
    expect(mockDoc.text).toHaveBeenCalledWith("54321 Beispielstadt");
    expect(mockDoc.text).toHaveBeenCalledWith("Deutschland");
  });
});
