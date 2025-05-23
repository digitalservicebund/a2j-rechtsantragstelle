import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { createHeader } from "../createHeader";

describe("createHeader", () => {
  it("should create header with header text and user names", () => {
    const userData: ProzesskostenhilfeFormularUserData = {
      vorname: "Alfred J.",
      nachname: "Kwack",
    };
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createHeader(mockDoc, mockStruct, userData, "Header Text");

    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Header Text von Alfred J. Kwack",
    );
  });
});
