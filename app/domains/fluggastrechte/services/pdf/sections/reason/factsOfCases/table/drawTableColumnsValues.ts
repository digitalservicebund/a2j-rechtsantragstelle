import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { drawCell } from "./drawCell";
import { getConnectionDetails } from "./getConnectionDetails";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "./tableConfigurations";

const ROWS_NUMBER = 3; // How many rows this function will create in the table

export function drawTableColumnsValues(
  doc: PDFKit.PDFDocument,
  tableStruct: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechtContext,
) {
  const { info, timeTable } = getConnectionDetails(userData);
  const plannedFlight = [
    userData.direktFlugnummer,
    `${userData.direktAbflugsDatum}, ${userData.direktAbflugsZeit}`,
    `${userData.direktAnkunftsDatum}, ${userData.direktAnkunftsZeit}`,
  ];
  const connectionTimetable = [...plannedFlight, ...timeTable];

  for (let index = 0; index < connectionTimetable.length; index++) {
    const tableValueColumns = doc.struct("TR"); // Create new TR for each set of connectionTimetable

    tableValueColumns.add(
      doc.struct("TD", {}, () => {
        const columnValue = connectionTimetable[index];
        const columnOffset = index <= ROWS_NUMBER - 1 ? 1 : 2; // Planned connectionTimetable go in the second column, actual in the fourth
        const adjustedIndex = (index % ROWS_NUMBER) + 1; // Calculate the row for planned/actual connectionTimetable

        const xPosition = START_TABLE_X + COLUMN_WIDTH * columnOffset;
        const yPosition = startTableY + COLUMN_HEIGHT * adjustedIndex;

        drawCell(doc, {
          xPosition,
          yPosition,
          width: COLUMN_WIDTH,
          height: COLUMN_HEIGHT,
          boldText: "", // No label text, only the value
          regularText: columnValue ?? "",
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
        xPosition: START_TABLE_X + COLUMN_WIDTH * ROWS_NUMBER,
        yPosition: startTableY + COLUMN_HEIGHT,
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT * ROWS_NUMBER,
        boldText: "", // No label text, only the value
        regularText: info,
        shouldAddSilverBackground: false,
        textAlign: "center",
        regularTextFontSize: 9,
      });
    }),
  );
  tableStruct.add(durationRow); // Add the row to the parent structure
}
