import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createStatementClaim } from "../createStatementClaim";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { addDefendantPartyList } from "../claimData/addDefendantPartyList";
import { addAdditionalApplicationsFreeText } from "../claimData/addAdditionalApplicationsFreeText";
import { addNegotiationText } from "../claimData/addNegotiationText";

vi.mock("../claimData/addDefendantPartyList");
vi.mock("../claimData/addAdditionalApplicationsFreeText");
vi.mock("../claimData/addNegotiationText");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createStatementClaim", () => {
  it("should render title and create a new page for free-text applications", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith("Klageantrag");
    expect(mockDoc.addPage).toHaveBeenCalledTimes(1);
  });

  it("should call addDefendantPartyList with main claim values", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(addDefendantPartyList).toHaveBeenCalledTimes(1);
    expect(addDefendantPartyList).toHaveBeenCalledWith(
      mockDoc,
      mockStruct,
      userDataMock.prozesszinsen,
      "9.999,00",
      userDataMock.anwaltskosten,
    );
  });

  it("should show Weitere Antraege title when shouldShowWeitereAntraege is true", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userData: GeldEinklagenFormularUserData = {
      ...userDataMock,
      videoVerhandlung: "yes",
      versaeumnisurteil: "no",
      muendlicheVerhandlung: "no",
      weitereAntraege: "I also request X.",
    };

    createStatementClaim(mockDoc, mockStruct, userData);

    expect(addAdditionalApplicationsFreeText).toHaveBeenCalledTimes(1);
    expect(addAdditionalApplicationsFreeText).toHaveBeenCalledWith(
      mockDoc,
      userData.weitereAntraege,
      mockStruct,
    );
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));
  });

  it("should not show Weitere Antraege title when shouldShowWeitereAntraege is false", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userData: GeldEinklagenFormularUserData = {
      ...userDataMock,
      videoVerhandlung: "noSpecification",
      versaeumnisurteil: "no",
      muendlicheVerhandlung: "no",
      weitereAntraege: "",
    };

    createStatementClaim(mockDoc, mockStruct, userData);

    expect(mockDoc.text).not.toHaveBeenCalledWith("Weitere Anträge:");
  });

  it("should call addNegotiationText with negotiation fields", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStatementClaim(mockDoc, mockStruct, userDataMock);

    expect(addNegotiationText).toHaveBeenCalledTimes(1);
    expect(addNegotiationText).toHaveBeenCalledWith(
      mockDoc,
      userDataMock.videoVerhandlung,
      userDataMock.versaeumnisurteil,
      userDataMock.muendlicheVerhandlung,
      mockStruct,
    );
  });
});
