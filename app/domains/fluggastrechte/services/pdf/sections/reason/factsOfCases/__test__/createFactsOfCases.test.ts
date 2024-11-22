import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addFlightDetails } from "../addFlightDetails";
import { addReason } from "../addReason";
import { addCompensationAmount } from "../compensationAmount/addCompensationAmount";
import { createFactsOfCases, FACTS_OF_CASES_TEXT } from "../createFactsOfCases";
import { addDetailedReason } from "../detailedReason/addDetailedReason";
import { addTable } from "../table/addTable";

vi.mock("../addReason");
vi.mock("../detailedReason/addDetailedReason");
vi.mock("../addFlightDetails");
vi.mock("../table/addTable");
vi.mock("../compensationAmount/addCompensationAmount");

vi.mocked(addReason).mockImplementation(() => vi.fn());
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

    createFactsOfCases(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(FACTS_OF_CASES_TEXT);
  });

  it("should call the addReason for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFactsOfCases(mockDoc, mockStruct, userDataMock);

    expect(addReason).toBeCalledTimes(1);
  });

  it("should call the addTable for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFactsOfCases(mockDoc, mockStruct, userDataMock);

    expect(addTable).toBeCalledTimes(1);
  });

  it("should call the addFlightDetails for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFactsOfCases(mockDoc, mockStruct, userDataMock);

    expect(addFlightDetails).toBeCalledTimes(1);
  });

  it("should call the addDetailedReason for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFactsOfCases(mockDoc, mockStruct, userDataMock);

    expect(addDetailedReason).toBeCalledTimes(1);
  });

  it("should call the createAdditionalInformation for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFactsOfCases(mockDoc, mockStruct, userDataMock);

    expect(addCompensationAmount).toBeCalledTimes(1);
  });
});
