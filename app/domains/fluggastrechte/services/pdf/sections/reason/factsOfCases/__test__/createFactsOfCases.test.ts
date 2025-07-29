import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addFlightDetails } from "../addFlightDetails";
import { addReasonCaption } from "../addReasonCaption";
import { addCompensationAmount } from "../compensationAmount/addCompensationAmount";
import { createFactsOfCases, FACTS_OF_CASES_TEXT } from "../createFactsOfCases";
import { addDetailedReason } from "../detailedReason/addDetailedReason";
import { addTable } from "../table/addTable";

vi.mock("../addReasonCaption");
vi.mock("../detailedReason/addDetailedReason");
vi.mock("../addFlightDetails");
vi.mock("../table/addTable");
vi.mock("../compensationAmount/addCompensationAmount");

vi.mocked(addReasonCaption).mockImplementation(() => vi.fn());
vi.mocked(addFlightDetails).mockImplementation(() => vi.fn());
vi.mocked(addDetailedReason).mockImplementation(() => vi.fn());
vi.mocked(addTable).mockImplementation(() => vi.fn());

vi.mocked(addCompensationAmount).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.resetAllMocks();
});

describe("createFactsOfCases", () => {
  it("should render document with reason title text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    createFactsOfCases(mockDoc, mockSect, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(FACTS_OF_CASES_TEXT);
  });

  it("should call the addFlightDetails for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    createFactsOfCases(mockDoc, mockSect, mockStruct, userDataMock);

    expect(addFlightDetails).toBeCalledTimes(1);
  });

  it("should call the addDetailedReason for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    createFactsOfCases(mockDoc, mockSect, mockStruct, userDataMock);

    expect(addDetailedReason).toBeCalledTimes(1);
  });
});
