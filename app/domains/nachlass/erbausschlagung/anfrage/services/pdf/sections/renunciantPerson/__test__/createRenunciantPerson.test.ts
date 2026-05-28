import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createRenunciantPerson } from "../createRenunciantPerson";
import { addRenunciantPersonAddress } from "../addRenunciantPersonAddress";
import { addRenunciantPersonDetails } from "../addRenunciantPersonDetails";
import { addRenunciantPersonContactDetails } from "../addRenunciantPersonContactDetails";

vi.mock("../addRenunciantPersonAddress");
vi.mock("../addRenunciantPersonDetails");
vi.mock("../addRenunciantPersonContactDetails");

vi.mocked(addRenunciantPersonAddress).mockImplementation(() => vi.fn());
vi.mocked(addRenunciantPersonDetails).mockImplementation(() => vi.fn());
vi.mocked(addRenunciantPersonContactDetails).mockImplementation(() => vi.fn());

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createRenunciantPerson", () => {
  it("should create the title ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createRenunciantPerson(mockDoc, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith("II. Ausschlagende Person", {
      align: "left",
    });
  });

  it("should call addRenunciantPersonAddress", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createRenunciantPerson(mockDoc, mockStruct, {});

    expect(addRenunciantPersonAddress).toHaveBeenCalledTimes(1);
  });

  it("should call addRenunciantPersonDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createRenunciantPerson(mockDoc, mockStruct, {});

    expect(addRenunciantPersonDetails).toHaveBeenCalledTimes(1);
  });

  it("should call addRenunciantPersonContactDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createRenunciantPerson(mockDoc, mockStruct, {});

    expect(addRenunciantPersonContactDetails).toHaveBeenCalledTimes(1);
  });

  it("should add the relationship with testator details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createRenunciantPerson(mockDoc, mockStruct, {
      ausschlagendePersonBeziehungZumErblasser: "mother-father",
    });

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Familienverhältnis zum Erblasser: ",
      { continued: true },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Erblasser ist mein(e) Mutter/Vater",
    );
  });

  it("should add the acknowledgment details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createRenunciantPerson(mockDoc, mockStruct, {
      dateOfReceipt: { day: "01", month: "01", year: "2020" },
      weitereAngaben: "Some additional info",
    });

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Kenntnisnahme der Erbenstellung am: ",
      { continued: true },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.2020");
    expect(mockDoc.text).toHaveBeenCalledWith("Anmerkung zur Kenntnisnahme: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Some additional info");
  });
});
