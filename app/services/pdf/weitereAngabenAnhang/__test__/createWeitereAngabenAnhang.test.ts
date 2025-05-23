import {
  mockPdfKitDocumentStructure,
  mockPdfKitDocument,
} from "tests/factories/mockPdfKit";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { createWeitereAngabenAnhang } from "../createWeitereAngabenAnhang";

describe("createWeitereAngabenAnhang", () => {
  it("should add weitereAngaben section to the pdf if weiterAngaben is provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userData = {
      weitereAngaben: "Weitere Angaben Example Text",
    } as ProzesskostenhilfeFormularUserData;

    createWeitereAngabenAnhang(mockDoc, mockStruct, userData);
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith(userData.weitereAngaben);
  });
  it("should not add weitereAngaben section to the pdf if weitereAngaben is not provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userData = {} as ProzesskostenhilfeFormularUserData;

    createWeitereAngabenAnhang(mockDoc, mockStruct, userData);
    expect(mockDoc.text).not.toHaveBeenCalledWith(userData.weitereAngaben);
  });
});
