import { type Mock } from "vitest";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addAttributeToTableCell } from "../addAttributeToTableCell";
import { drawCell } from "../drawCell";
import { drawTableRows } from "../drawTableRows";
import { drawTextCell } from "../drawTextCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "../tableConfigurations";

vi.mock("../drawCell");
vi.mock("../addAttributeToTableCell");
vi.mock("../drawTextCell");

vi.mocked(drawCell).mockImplementation(() => vi.fn());
vi.mocked(addAttributeToTableCell).mockImplementation(() => vi.fn());
vi.mocked(drawTextCell).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("drawTableRows - Headers", () => {
  it("should call drawTextCell to print the cell about the flight number", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRows(mockDoc, mockStruct, 0, userDataMock);

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X,
      expect.any(Number),
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Flugnummer",
      "betroffener Flug",
      true,
      "left",
    );
  });

  it("should call drawTextCell to print the cell about the takeoff info", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRows(mockDoc, mockStruct, 0, userDataMock);

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X,
      expect.any(Number),
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Abflug Datum, Zeit",
      "Startflughafen",
      true,
      "left",
    );
  });

  it("should call drawTextCell to print the cell about the landed info", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRows(mockDoc, mockStruct, 0, userDataMock);

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X,
      expect.any(Number),
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Ankunft Datum, Zeit",
      "Zielflughafen",
      true,
      "left",
    );
  });

  it("should mark first cell in each row as a TH with Scope='Row'", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRows(mockDoc, mockStruct, 0, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("TH", {}, expect.any(Function));
    const callsWithTH = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "TH",
    );
    expect(callsWithTH).toHaveLength(3);

    expect(addAttributeToTableCell).toHaveBeenCalledWith(
      mockDoc,
      expect.any(Object),
      expect.objectContaining({ Scope: "Row" }),
    );
  });

  describe("drawTableRows - Delay Cell", () => {
    it("should add delay cell with correct RowSpan", () => {
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      drawTableRows(mockDoc, mockStruct, 0, userDataMock);

      expect(addAttributeToTableCell).toHaveBeenCalledWith(
        mockDoc,
        expect.any(Object),
        expect.objectContaining({ RowSpan: 3 }),
      );
    });
  });
});
