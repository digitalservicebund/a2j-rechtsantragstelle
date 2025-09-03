import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addAirlineDetails } from "../addAirlineDetails";

describe("addAirlineDetails", () => {
  it("should generate document with airline details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAirlineDetails(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Deutsche Lufthansa AG", {
      continued: true,
    });
  });

  it("should generate document with airline address details when the address is enter manually", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAirlineDetails(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `${userDataMock.fluggesellschaftStrasseHausnummer}, ${userDataMock.fluggesellschaftPostleitzahl} ${userDataMock.fluggesellschaftOrt}, ${userDataMock.fluggesellschaftLand}`,
    );
  });

  it("should generate document with airline address details when comes from the db", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataMockWithDbAddress = {
      ...userDataMock,
      fluggesellschaftAuswahlAddress: "fromAirlineDB" as const,
      fluggesellschaft: "LH", // Lufthansa
      fluggesellschaftStrasseHausnummer: undefined,
      fluggesellschaftPostleitzahl: undefined,
      fluggesellschaftOrt: undefined,
      fluggesellschaftLand: undefined,
    };

    addAirlineDetails(mockDoc, userDataMockWithDbAddress);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Venloer Straße 151 - 153, Köln 50672, Deutschland",
    );
  });
});
