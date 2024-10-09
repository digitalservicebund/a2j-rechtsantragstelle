import { drawCell } from "./drawCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
  START_TABLE_Y,
} from "./tableConfigurations";

export function drawTableColumnsValues(
  doc: PDFKit.PDFDocument,
  tableStruct: PDFKit.PDFStructureElement,
) {
  const values = [
    "10.03.2024 20:30",
    "10.03.2024 23:45",
    "--",
    "11.03.2024 03:19",
  ];

  for (let index = 0; index < values.length; index++) {
    const tableValueColumns = doc.struct("TR"); // Create new TR for each set of values

    tableValueColumns.add(
      doc.struct("TD", {}, () => {
        const columnValue = values[index];
        const columnOffset = index <= 1 ? 1 : 2; // Planned values go in the second column, actual in the fourth
        const adjustedIndex = (index % 2) + 1; // Calculate the row for planned/actual values

        const xPosition = START_TABLE_X + COLUMN_WIDTH * columnOffset;
        const yPosition = START_TABLE_Y + COLUMN_HEIGHT * adjustedIndex;

        drawCell(doc, {
          xPosition,
          yPosition,
          width: COLUMN_WIDTH,
          height: COLUMN_HEIGHT,
          boldText: "", // No label text, only the value
          regularText: columnValue,
          shouldAddSilverBackground: false,
          textAlign: "center",
          regularTextFontSize: 10,
        });
      }),
    );
    tableStruct.add(tableValueColumns); // Add the TR to the parent structure after each iteration
  }

  const durationRow = doc.struct("TR"); // Create a row for the duration
  durationRow.add(
    doc.struct("TD", {}, () => {
      drawCell(doc, {
        xPosition: START_TABLE_X + COLUMN_WIDTH * 3,
        yPosition: START_TABLE_Y + COLUMN_HEIGHT,
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT * 2,
        boldText: "", // No label text, only the value
        regularText: "12 Stunden 34 Minuten tess",
        shouldAddSilverBackground: false,
        textAlign: "center",
        regularTextFontSize: 10,
        shouldDrawRectangle: false,
      });
    }),
  );
  tableStruct.add(durationRow); // Add the row to the parent structure
}
