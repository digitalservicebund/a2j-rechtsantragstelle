import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addTable } from "../addTable";
import { addTableInfo } from "../addTableInfo";
import { drawTableColumnHeaders } from "../drawTableColumnHeaders";
import { drawTableRows } from "../drawTableRows";

vi.mock("../drawTableColumnHeaders");
vi.mock("../drawTableRows");
vi.mock("../addTableInfo");

vi.mocked(drawTableColumnHeaders).mockImplementation(() => vi.fn());
vi.mocked(drawTableRows).mockImplementation(() => vi.fn());
vi.mocked(addTableInfo).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("addTable", () => {
  it("should call drawTableColumnsHeaderRow and drawTableRows", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addTable(mockDoc, mockStruct, 0, userDataMock);

    expect(drawTableColumnHeaders).toBeCalledTimes(1);
    expect(drawTableRows).toBeCalledTimes(1);
  });

  it("should call addTableInfo", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addTable(mockDoc, mockStruct, 0, userDataMock);

    expect(addTableInfo).toBeCalledTimes(1);
  });
});
