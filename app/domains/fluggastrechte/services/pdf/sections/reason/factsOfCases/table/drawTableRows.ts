import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { drawCellBackground, drawCellText } from "./drawCell";
import { getConnectionDetails } from "./getConnectionDetails";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "./tableConfigurations";

export function drawTableRows(
  doc: PDFKit.PDFDocument,
  table: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechteUserData,
) {
  const { info, timeTable } = getConnectionDetails(userData);

  const ROWS_NUMBER = 3; // How many rows this function will create in the table

  const headers = [
    { title: "Flugnummer", subtitle: "betroffener Flug" },
    { title: "Abflug Datum, Zeit", subtitle: "Startflughafen" },
    { title: "Ankunft Datum, Zeit", subtitle: "Zielflughafen" },
  ];

  const plannedFlight = [
    userData.direktFlugnummer,
    `${userData.direktAbflugsDatum}, ${userData.direktAbflugsZeit}`,
    `${userData.direktAnkunftsDatum}, ${userData.direktAnkunftsZeit}`,
  ];

  const connectionTimetable = [...plannedFlight, ...timeTable];

  const tableBody = doc.struct("TBody");

  for (let rowIndex = 0; rowIndex < headers.length; rowIndex++) {
    const tableRow = doc.struct("TR");

    // Row header cell
    const rowHeaderCell = doc.struct("TH", {}, () => {
      drawCellText(doc, {
        xPosition: START_TABLE_X,
        yPosition: startTableY + COLUMN_HEIGHT * (rowIndex + 1),
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT,
        boldText: headers[rowIndex].title,
        regularText: headers[rowIndex].subtitle,
        shouldAddSilverBackground: true,
        textAlign: "left",
      });
    });

    rowHeaderCell.dictionary.data.A = doc.ref({
      O: "Table",
      Scope: "Row",
    });

    rowHeaderCell.dictionary.data.A.end();

    drawCellBackground(doc, {
      xPosition: START_TABLE_X,
      yPosition: startTableY + COLUMN_HEIGHT * (rowIndex + 1),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      shouldAddSilverBackground: true,
    });
    tableRow.add(rowHeaderCell);

    // Data cells
    for (let colIndex = 0; colIndex < 2; colIndex++) {
      const valueIndex = colIndex * 3 + rowIndex;
      const cellValue = connectionTimetable[valueIndex] ?? "";
      const xPosition = START_TABLE_X + COLUMN_WIDTH * (colIndex + 1);
      const yPosition = startTableY + COLUMN_HEIGHT * (rowIndex + 1);

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

    tableBody.add(tableRow);
  }
  table.add(tableBody);
}

// const durationRow = doc.struct("TR"); // Create a row for the duration
// durationRow.add(
//   doc.struct("TD", {}, () => {
//     drawCell(doc, {
//       xPosition: START_TABLE_X + COLUMN_WIDTH * ROWS_NUMBER,
//       yPosition: startTableY + COLUMN_HEIGHT,
//       width: COLUMN_WIDTH,
//       height: COLUMN_HEIGHT * ROWS_NUMBER,
//       boldText: "", // No label text, only the value
//       regularText: info,
//       shouldAddSilverBackground: false,
//       textAlign: "center",
//       regularTextFontSize: 9,
//     });
//   }),
// );
