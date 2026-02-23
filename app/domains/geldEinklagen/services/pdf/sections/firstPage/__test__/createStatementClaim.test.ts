import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createStatementClaim } from "../createStatementClaim";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { addDefendantPartyList } from "../claimData/addDefendantPartyList";
import { addFreeTextApplication } from "../claimData/addFreeTextApplication";
import { addNegotiationText } from "../claimData/addNegotiationText";

vi.mock("../claimData/addDefendantPartyList");
vi.mock("../claimData/addFreeTextApplication");
vi.mock("../claimData/addNegotiationText");

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

  it("should call addFreeTextApplication", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(addFreeTextApplication).toHaveBeenCalledWith(
      mockDoc,
      userDataMock.weitereAntraege,
      mockStruct,
    );
  });

  it("should call addNegotiationText", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(addNegotiationText).toHaveBeenCalledWith(
      mockDoc,
      userDataMock.videoVerhandlung,
      userDataMock.versaeumnisurteil,
      userDataMock.muendlicheVerhandlung,
      mockStruct,
    );
  });
});
