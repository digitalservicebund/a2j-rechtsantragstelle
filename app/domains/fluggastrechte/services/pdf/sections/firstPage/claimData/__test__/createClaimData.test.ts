import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addAirlineDetails } from "../addAirlineDetails";
import { addPlaintiffDetails } from "../addPlaintiffDetails";
import { addPlannedFlightDetails } from "../addPlannedFlightDetails";
import { AGAINST, createClaimData, IN_THE_MATTER } from "../createClaimData";

vi.mock("../addPlaintiffDetails");
vi.mock("../addAirlineDetails");
vi.mock("../addPlannedFlightDetails");

vi.mocked(addPlaintiffDetails).mockImplementation(() => vi.fn());
vi.mocked(addAirlineDetails).mockImplementation(() => vi.fn());
vi.mocked(addPlannedFlightDetails).mockImplementation(() => vi.fn());

describe("createClaimData", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create document with in the matter and against texts", () => {
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

  it("should call addPlannedFlightDetails", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createClaimData(mockDoc, mockStruct, userDataMock);

    expect(addPlannedFlightDetails).toBeCalledTimes(1);
  });
});
