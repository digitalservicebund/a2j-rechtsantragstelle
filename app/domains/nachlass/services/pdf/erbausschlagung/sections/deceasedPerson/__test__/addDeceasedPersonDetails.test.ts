import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { addDeceasedPersonDetails } from "../addDeceasedPersonDetails";

const userDataMock = {
  verstorbeneVorname: "Max",
  verstorbeneNachname: "Mustermann",
} satisfies NachlassErbausschlagungAnfrageUserData;

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
});
