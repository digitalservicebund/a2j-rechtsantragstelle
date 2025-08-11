import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { addTableInfo } from "./addTableInfo";
import { drawTableColumnHeaderRow } from "./drawTableColumnHeaderRow";
import { drawTableRows } from "./drawTableRows";
import { COLUMN_HEIGHT, MARGIN_BOTTOM } from "./tableConfigurations";

export function addTable(
  doc: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechteUserData,
) {
  const tableSect = doc.struct("Sect");

  const table = doc.struct("Table");

  drawTableColumnHeaderRow(doc, table, startTableY, userData);
  drawTableRows(doc, table, startTableY, userData);

  tableSect.add(table); // Add the table to the section
  documentStruct.add(tableSect); // Add the section to the parent structure
  // Get end position of the table generated
  const tableEndYPosition = startTableY + COLUMN_HEIGHT * 4 + MARGIN_BOTTOM;
  doc.y = tableEndYPosition;
  doc.fillColor("black");

  addTableInfo(
    doc,
    documentStruct,
    userData.andereErsatzverbindungBeschreibung ?? "",
  );
}
