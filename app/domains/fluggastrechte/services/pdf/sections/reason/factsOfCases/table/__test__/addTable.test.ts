import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addTable } from "../addTable";
import { addTableInfo } from "../addTableInfo";
import { drawTableColumnsHead } from "../drawTableColumnHead";
import { drawTableColumnsValues } from "../drawTableColumnsValues";
import { drawTableRowHead } from "../drawTableRowHead";

vi.mock("../drawTableRowHead");
vi.mock("../drawTableColumnHead");
vi.mock("../drawTableColumnsValues");
vi.mock("../addTableInfo");

vi.mocked(drawTableColumnsHead).mockImplementation(() => vi.fn());
vi.mocked(drawTableColumnsValues).mockImplementation(() => vi.fn());
vi.mocked(drawTableRowHead).mockImplementation(() => vi.fn());
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

    expect(drawTableColumnsHead).toBeCalledTimes(1);
    expect(drawTableColumnsValues).toBeCalledTimes(1);
    expect(drawTableRowHead).toBeCalledTimes(1);
  });

  it("should call addTableInfo", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addTable(mockDoc, mockStruct, 0, userDataMock);

    expect(addTableInfo).toBeCalledTimes(1);
  });
});
