import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addAirlineDetails } from "../addAirlineDetails";
import { addFlightDetails } from "../addFlightDetails";
import { addPlaintiffDetails } from "../addPlaintiffDetails";
import { AGAINST, createClaimData, IN_THE_MATTER } from "../createClaimData";

vi.mock("../addPlaintiffDetails");
vi.mock("../addAirlineDetails");
vi.mock("../addFlightDetails");

vi.mocked(addPlaintiffDetails).mockImplementation(() => vi.fn());
vi.mocked(addAirlineDetails).mockImplementation(() => vi.fn());
vi.mocked(addFlightDetails).mockImplementation(() => vi.fn());

describe("createClaimData", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create document with in the matter and agains texts", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.fontSize).toHaveBeenCalledWith(14);
    expect(mockDoc.text).toHaveBeenCalledWith(IN_THE_MATTER);
    expect(mockDoc.moveDown).toHaveBeenCalled();

    expect(mockDoc.fontSize).toHaveBeenCalledWith(14);
    expect(mockDoc.text).toHaveBeenCalledWith(AGAINST, { align: "left" });
    expect(mockDoc.moveDown).toHaveBeenCalled();
  });

  it("should call addPlaintiffDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct);

    expect(addPlaintiffDetails).toBeCalledTimes(1);
  });

  it("should call addAirlineDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct);

    expect(addAirlineDetails).toBeCalledTimes(1);
  });

  it("should call addFlightDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct);

    expect(addFlightDetails).toBeCalledTimes(1);
  });
});
