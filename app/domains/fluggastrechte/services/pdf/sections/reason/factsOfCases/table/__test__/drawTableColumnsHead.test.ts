import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { drawCell } from "../drawCell";
import { drawTableColumnsHead } from "../drawTableColumnHead";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "../tableConfigurations";

vi.mock("../drawCell");

vi.mocked(drawCell).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("drawTableColumnsHead", () => {
  it("should call drawCell to print the cell about the flight number", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableColumnsHead(mockDoc, mockStruct, 0);

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: START_TABLE_X,
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Flugnummer",
      regularText: "betroffener Flug",
      shouldAddSilverBackground: true,
      textAlign: "left",
    });
  });

  it("should call drawCell to print the cell about the takeoff info", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableColumnsHead(mockDoc, mockStruct, 0);

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: START_TABLE_X,
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Abflug Datum, Zeit",
      regularText: "Startflughafen",
      shouldAddSilverBackground: true,
      textAlign: "left",
    });
  });

  it("should call drawCell to print the cell about the landed info", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableColumnsHead(mockDoc, mockStruct, 0);

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: START_TABLE_X,
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Ankunft, Zeit",
      regularText: "Zielflughafen",
      shouldAddSilverBackground: true,
      textAlign: "left",
    });
  });
});
