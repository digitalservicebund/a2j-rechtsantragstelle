import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { addDeceasedPersonNotificationDetails } from "../addDeceasedPersonNotificationDetails";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";

const userDataMock = {
  verstorbeneNotification: "yes",
  verstorbeneVorname: "Max",
  verstorbeneNachname: "Mustermann",
  verstorbeneGeburtsdatum: {
    day: "01",
    month: "01",
    year: "1970",
  },
  aktenzeichen: "1234567890",
  nachlassgericht: "1234567890",
  verstorbeneSterbedatum: {
    day: "01",
    month: "01",
    year: "2020",
  },
} satisfies NachlassErbausschlagungAnfrageUserData;

describe("addDeceasedPersonNotificationDetails", () => {
  it("should add notification details in case the user has received notification", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonNotificationDetails(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Nachlassgericht: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("1234567890");
    expect(mockDoc.text).toHaveBeenCalledWith("Aktenzeichen: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("1234567890");
  });

  it("should add birthday and death details in case the user has not received notification", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonNotificationDetails(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneNotification: "no",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsdatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.1970");
    expect(mockDoc.text).toHaveBeenCalledWith("Sterbedatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.2020");
  });
});
