import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { addAttributeToTableCell } from "./addAttributeToTableCell";
import { drawTextCell } from "./drawTextCell";
import { getConnectionDetails } from "./getConnectionDetails";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "./tableConfigurations";

const HEADERS = [
  { title: "Flugnummer", subtitle: "betroffener Flug" },
  { title: "Abflug Datum, Zeit", subtitle: "Startflughafen" },
  { title: "Ankunft Datum, Zeit", subtitle: "Zielflughafen" },
] as const;

const ROWS_NUMBER = HEADERS.length;

function createHeaderCell(
  doc: PDFKit.PDFDocument,
  rowIndex: number,
  y: number,
) {
  const headerCell = drawTextCell(doc, "TH", {
    x: START_TABLE_X,
    y,
    width: COLUMN_WIDTH,
    height: COLUMN_HEIGHT,
    boldText: HEADERS[rowIndex].title,
    regularText: HEADERS[rowIndex].subtitle,
    shouldAddSilverBackground: true,
    textAlign: "left",
  });
  addAttributeToTableCell(doc, headerCell, { O: "Table", Scope: "Row" });
  return headerCell;
}

function createDataCells(
  doc: PDFKit.PDFDocument,
  rowIndex: number,
  y: number,
  connectionTimetable: string[],
) {
  const cells: PDFKit.PDFStructureElement[] = [];
  for (let colIndex = 1; colIndex <= 2; colIndex++) {
    const valueIndex = (colIndex - 1) * ROWS_NUMBER + rowIndex;
    const cellValue = connectionTimetable[valueIndex] ?? "";

    const tdCell = drawTextCell(doc, "TD", {
      x: START_TABLE_X + COLUMN_WIDTH * colIndex,
      y,
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "",
      regularText: cellValue,
      shouldAddSilverBackground: false,
      textAlign: "center",
      regularTextFontSize: 10,
    });

    cells.push(tdCell);
  }
  return cells;
}

function createDelayCell(doc: PDFKit.PDFDocument, y: number, info: string) {
  const delayCell = drawTextCell(doc, "TD", {
    x: START_TABLE_X + COLUMN_WIDTH * ROWS_NUMBER,
    y,
    width: COLUMN_WIDTH,
    height: COLUMN_HEIGHT * ROWS_NUMBER,
    boldText: "",
    regularText: info,
    shouldAddSilverBackground: false,
    textAlign: "center",
    regularTextFontSize: 9,
  });

  addAttributeToTableCell(doc, delayCell, { RowSpan: ROWS_NUMBER });
  return delayCell;
}

export function drawTableRows(
  doc: PDFKit.PDFDocument,
  table: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechteUserData,
) {
  const { info, timeTable } = getConnectionDetails(userData);

  const plannedFlight = [
    userData.direktFlugnummer ?? "",
    `${userData.direktAbflugsDatum ?? ""}, ${userData.direktAbflugsZeit ?? ""}`,
    `${userData.direktAnkunftsDatum ?? ""}, ${userData.direktAnkunftsZeit ?? ""}`,
  ];

  const connectionTimetable = [...plannedFlight, ...timeTable];
  const tableBody = doc.struct("TBody");

  for (let rowIndex = 0; rowIndex < ROWS_NUMBER; rowIndex++) {
    const tableRow = doc.struct("TR");
    const y = startTableY + COLUMN_HEIGHT * (rowIndex + 1);

    // Header cell
    tableRow.add(createHeaderCell(doc, rowIndex, y));

    // Data cells
    createDataCells(doc, rowIndex, y, connectionTimetable).forEach((cell) =>
      tableRow.add(cell),
    );

    // Delay cell only on first row but spans all rows
    if (rowIndex === 0) {
      tableRow.add(createDelayCell(doc, startTableY + COLUMN_HEIGHT, info));
    }

    tableBody.add(tableRow);
  }

  table.add(tableBody);
}
