import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { createNachlass } from "~/domains/nachlass/services/pdf/erbschein/sections/nachlass/createNachlass";

const userDataMock: NachlassErbscheinAnfrageUserData = {
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
});
