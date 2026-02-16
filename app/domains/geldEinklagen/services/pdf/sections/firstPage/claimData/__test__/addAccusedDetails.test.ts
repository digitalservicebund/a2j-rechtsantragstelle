import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { addAccusedDetails } from "../addAccusedDetails";

describe("addAccusedDetails", () => {
  it("should generate document with accused details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAccusedDetails(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Beklagtevorname beklagteNachname",
      {
        continued: true,
      },
    );
  });

  it("should generate document with accused address details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAccusedDetails(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `${userDataMock.beklagteStrasseHausnummer}, ${userDataMock.beklagtePlz} ${userDataMock.beklagteOrt}, Deutschland`,
    );
  });
});
