import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addTable } from "../addTable";
import { addTableInfo } from "../addTableInfo";
import { drawTableRows } from "../drawTableRows";
import { drawTableColumnsValues } from "../drawTableColumnsValues";
import { drawTableColumnHeaderRow } from "../drawTableColumnHeaderRow";

vi.mock("../drawTableRowHead");
vi.mock("../drawTableColumnHead");
vi.mock("../drawTableColumnsValues");
vi.mock("../addTableInfo");

vi.mocked(drawTableRows).mockImplementation(() => vi.fn());
vi.mocked(drawTableColumnsValues).mockImplementation(() => vi.fn());
vi.mocked(drawTableRows).mockImplementation(() => vi.fn());
vi.mocked(addTableInfo).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("addTable", () => {
  it("should call drawTableColumnsHead, drawTableColumnsValues and drawTableRowHead", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addTable(mockDoc, mockStruct, 0, userDataMock);

    expect(drawTableRows).toBeCalledTimes(1);
    expect(drawTableColumnsValues).toBeCalledTimes(1);
    expect(drawTableRows).toBeCalledTimes(1);
  });

  it("should call addTableInfo", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addTable(mockDoc, mockStruct, 0, userDataMock);

    expect(addTableInfo).toBeCalledTimes(1);
  });
});
