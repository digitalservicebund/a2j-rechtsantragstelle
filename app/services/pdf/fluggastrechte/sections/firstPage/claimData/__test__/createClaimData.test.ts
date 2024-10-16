import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
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

    createClaimData(mockDoc, mockStruct, userDataMock);

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

    createClaimData(mockDoc, mockStruct, userDataMock);

    expect(addPlaintiffDetails).toBeCalledTimes(1);
  });

  it("should call addAirlineDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct, userDataMock);

    expect(addAirlineDetails).toBeCalledTimes(1);
  });

  it("should call addFlightDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct, userDataMock);

    expect(addFlightDetails).toBeCalledTimes(1);
  });
});
