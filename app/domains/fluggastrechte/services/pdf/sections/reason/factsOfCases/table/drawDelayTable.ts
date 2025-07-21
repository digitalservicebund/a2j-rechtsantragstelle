import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FluggastrechtBereichType } from "~/domains/fluggastrechte/vorabcheck/userData";
import { drawCell } from "./drawCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "./tableConfigurations";
import { getConnectionDetails } from "./getConnectionDetails";

const DELAY_STATUS = {
  verspaetet: "Verspätung",
  nichtbefoerderung: "Nicht-Beförderung",
  annullierung: "Annullierung",
  anderes: "",
};

const COLUMN_NUMBER = 3;
const ROWS_NUMBER = 3;

const getDelayType = ({ bereich }: FluggastrechteUserData): string =>
  DELAY_STATUS[bereich as FluggastrechtBereichType] ?? "";

export function drawDelayTable(
  doc: PDFKit.PDFDocument,
  table: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechteUserData,
) {
  const { info, timeTable } = getConnectionDetails(userData);

  const headerRow = doc.struct("TR");

  const headerCell = doc.struct("TH");

  headerCell.add(
    doc.struct("Span", {}, () => {
      drawCell(doc, {
        xPosition: START_TABLE_X + COLUMN_WIDTH * COLUMN_NUMBER,
        yPosition: startTableY,
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT,
        boldText: getDelayType(userData),
        regularText: "",
        shouldAddSilverBackground: true,
        textAlign: "center",
      });
    }),
  );
  headerRow.add(headerCell);

  table.add(headerRow);

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
  table.add(durationRow); // Add the row to the parent structure
}
