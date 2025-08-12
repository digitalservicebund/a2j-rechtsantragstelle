import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addAttributeToTableCell } from "../addAttributeToTableCell";
import { addCellText } from "../addCellText";
import { drawCell } from "../drawCell";
import { drawTableRows } from "../drawTableRows";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "../tableConfigurations";

vi.mock("../drawCell");
vi.mock("../addCellText");
vi.mock("../addAttributeToTableCell");

vi.mocked(drawCell).mockImplementation(() => vi.fn());
vi.mocked(addCellText).mockImplementation(() => vi.fn());
vi.mocked(addAttributeToTableCell).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("drawTableRows - Headers", () => {
  it("should call addCellText to print the cell about the flight number", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRows(mockDoc, mockStruct, 0, userDataMock);

    expect(addCellText).toBeCalledWith(mockDoc, {
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

  it("should call addCellText to print the cell about the takeoff info", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRows(mockDoc, mockStruct, 0, userDataMock);

    expect(addCellText).toBeCalledWith(mockDoc, {
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

  it("should call addCellText to print the cell about the landed info", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRows(mockDoc, mockStruct, 0, userDataMock);

    expect(addCellText).toBeCalledWith(mockDoc, {
      xPosition: START_TABLE_X,
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Ankunft Datum, Zeit",
      regularText: "Zielflughafen",
      shouldAddSilverBackground: true,
      textAlign: "left",
    });
  });
});
