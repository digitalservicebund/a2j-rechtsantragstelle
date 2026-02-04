import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createStatementClaim } from "../createStatementClaim";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { addDefendantPartyList } from "../claimData/addDefendantPartyList";

vi.mock("../claimData/addDefendantPartyList");

describe("createStatementClaim", () => {
  it("should create the document with the statement claim correctly", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith("Klageantrag");
  });

  it("should call addDefendantPartyList", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(addDefendantPartyList).toHaveBeenCalledWith(
      mockDoc,
      mockStruct,
      userDataMock.prozesszinsen,
      0,
      userDataMock.anwaltskosten,
    );
  });
});
