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
});
