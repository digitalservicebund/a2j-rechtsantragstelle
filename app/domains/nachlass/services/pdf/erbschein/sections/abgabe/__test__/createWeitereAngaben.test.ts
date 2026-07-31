import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { createWeitereAngaben } from "~/domains/nachlass/services/pdf/erbschein/sections/abgabe/createWeitereAngaben";

const userDataMock: NachlassErbscheinAnfrageUserData = {
  weitereAngaben:
    "A lot of text explaining my very long and complicated situation that requires a lot of explanation.",
};

describe("createWeitereAngaben", () => {
  it("should print weitere angaben", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createWeitereAngaben(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.text).toHaveBeenCalledWith("Weitere Angaben: ");
    expect(mockDoc.text).toHaveBeenCalledWith(userDataMock.weitereAngaben);
  });
});
