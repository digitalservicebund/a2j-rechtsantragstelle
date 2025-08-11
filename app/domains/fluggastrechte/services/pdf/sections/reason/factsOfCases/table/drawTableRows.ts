import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { addAttributeToTableCell } from "./addAttributeToTableCell";
import { drawCellBackground, drawCellText } from "./drawCell";
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
];

const ROWS_NUMBER = HEADERS.length;

export function drawTableRows(
  doc: PDFKit.PDFDocument,
  table: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechteUserData,
) {
  const { info, timeTable } = getConnectionDetails(userData);

  const plannedFlight = [
    userData.direktFlugnummer,
    `${userData.direktAbflugsDatum}, ${userData.direktAbflugsZeit}`,
    `${userData.direktAnkunftsDatum}, ${userData.direktAnkunftsZeit}`,
  ];

  const connectionTimetable = [...plannedFlight, ...timeTable];
  const tableBody = doc.struct("TBody");

  for (let rowIndex = 0; rowIndex < ROWS_NUMBER; rowIndex++) {
    const tableRow = doc.struct("TR");

    // Header cell
    const headerCellY = startTableY + COLUMN_HEIGHT * (rowIndex + 1);
    const headerCell = doc.struct("TH", {}, () => {
      drawCellText(doc, {
        xPosition: START_TABLE_X,
        yPosition: headerCellY,
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT,
        boldText: HEADERS[rowIndex].title,
        regularText: HEADERS[rowIndex].subtitle,
        shouldAddSilverBackground: true,
        textAlign: "left",
      });
    });
    addAttributeToTableCell(doc, headerCell, { O: "Table", Scope: "Row" });
    drawCellBackground(doc, {
      xPosition: START_TABLE_X,
      yPosition: headerCellY,
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      shouldAddSilverBackground: true,
    });
    tableRow.add(headerCell);

    // Data cells
    for (let colIndex = 0; colIndex < 2; colIndex++) {
      const valueIndex = colIndex * ROWS_NUMBER + rowIndex;
      const cellValue = connectionTimetable[valueIndex] ?? "";
      const xPosition = START_TABLE_X + COLUMN_WIDTH * (colIndex + 1);
      const yPosition = headerCellY;

      const tdCell = doc.struct("TD", {}, () => {
        drawCellText(doc, {
          xPosition,
          yPosition,
          width: COLUMN_WIDTH,
          height: COLUMN_HEIGHT,
          boldText: "",
          regularText: cellValue,
          shouldAddSilverBackground: false,
          textAlign: "center",
          regularTextFontSize: 10,
        });
      });
      drawCellBackground(doc, {
        xPosition,
        yPosition,
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT,
        shouldAddSilverBackground: false,
      });
      tableRow.add(tdCell);
    }

    // Delay cell (rowSpan)
    if (rowIndex === 0) {
      const delayCellX = START_TABLE_X + COLUMN_WIDTH * ROWS_NUMBER;
      const delayCellY = startTableY + COLUMN_HEIGHT;
      const delayCell = doc.struct("TD", {}, () => {
        drawCellText(doc, {
          xPosition: delayCellX,
          yPosition: delayCellY,
          width: COLUMN_WIDTH,
          height: COLUMN_HEIGHT * ROWS_NUMBER,
          boldText: "",
          regularText: info,
          shouldAddSilverBackground: false,
          textAlign: "center",
          regularTextFontSize: 9,
        });
      });
      drawCellBackground(doc, {
        xPosition: delayCellX,
        yPosition: delayCellY,
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT * ROWS_NUMBER,
        shouldAddSilverBackground: false,
      });
      addAttributeToTableCell(doc, delayCell, {
        O: "Table",
        RowSpan: ROWS_NUMBER,
      });
      tableRow.add(delayCell);
    }

    tableBody.add(tableRow);
  }
  table.add(tableBody);
}
