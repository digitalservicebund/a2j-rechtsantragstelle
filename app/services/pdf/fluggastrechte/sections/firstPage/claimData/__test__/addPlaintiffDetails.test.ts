import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addPlaintiffDetails, PLAINTIFF_TEXT } from "../addPlaintiffDetails";

describe("addPlaintiffDetails", () => {
  it("should create document with plaintiff details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addPlaintiffDetails(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Fr. Test-test Test", {
      continued: true,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(PLAINTIFF_TEXT, {
      align: "left",
    });
  });
});
