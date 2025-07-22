import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { addTableInfo } from "./addTableInfo";
import { drawTableColumnsHead } from "./drawTableColumnHead";
import { drawTableColumnsValues } from "./drawTableColumnsValues";
import { drawTableRowHead } from "./drawTableRowHead";
import { COLUMN_HEIGHT, MARGIN_BOTTOM } from "./tableConfigurations";

export function addTable(
  doc: PDFKit.PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechteUserData,
) {
  const table = doc.struct("Table"); // Create new table structure element

  drawTableRowHead(doc, table, startTableY, userData); // Pass table as parent to avoid reusing `documentStruct`
  drawTableColumnsHead(doc, table, startTableY); // Use the table structure element
  drawTableColumnsValues(doc, table, startTableY, userData); // Continue with table structure element

  reasonSect.add(table); // Add the table to the section
  doc.fill("black"); // Fill black due next pages of the table
  // Get end position of the table generated
  const tableEndYPosition = startTableY + COLUMN_HEIGHT * 4 + MARGIN_BOTTOM;
  // reset the position of the table
  doc.y = tableEndYPosition;
  addTableInfo(
    doc,
    reasonSect,
    userData.andereErsatzverbindungBeschreibung ?? "",
  );
}
