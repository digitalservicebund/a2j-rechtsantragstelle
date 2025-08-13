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
    const y = startTableY + COLUMN_HEIGHT * (rowIndex + 1);

    const headerCell = drawTextCell(
      doc,
      "TH",
      START_TABLE_X,
      y,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      HEADERS[rowIndex].title,
      HEADERS[rowIndex].subtitle,
      true,
      "left",
    );

    addAttributeToTableCell(doc, headerCell, { O: "Table", Scope: "Row" });
    tableRow.add(headerCell);

    // Data cells
    for (let colIndex = 1; colIndex <= 2; colIndex++) {
      const valueIndex = (colIndex - 1) * ROWS_NUMBER + rowIndex;
      const cellValue = connectionTimetable[valueIndex] ?? "";

      const tdCell = drawTextCell(
        doc,
        "TD",
        START_TABLE_X + COLUMN_WIDTH * colIndex,
        y,
        COLUMN_WIDTH,
        COLUMN_HEIGHT,
        "",
        cellValue,
        false,
        "center",
        10,
      );

      tableRow.add(tdCell);
    }

    // Delay cell, spanning all rows
    if (rowIndex === 0) {
      const delayCell = drawTextCell(
        doc,
        "TD",
        START_TABLE_X + COLUMN_WIDTH * ROWS_NUMBER,
        startTableY + COLUMN_HEIGHT,
        COLUMN_WIDTH,
        COLUMN_HEIGHT * ROWS_NUMBER,
        "",
        info,
        false,
        "center",
        9,
      );

      addAttributeToTableCell(doc, delayCell, {
        RowSpan: ROWS_NUMBER,
      });
      tableRow.add(delayCell);
    }

    tableBody.add(tableRow);
  }

  table.add(tableBody);
}
