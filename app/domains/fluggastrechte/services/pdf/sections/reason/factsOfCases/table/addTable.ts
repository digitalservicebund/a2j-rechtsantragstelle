import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { addTableInfo } from "./addTableInfo";
import { drawDelayTable } from "./drawDelayTable";
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
  doc.fill("black"); // Fill black due next pages of the table
  // Get end position of the table generated
  const tableEndYPosition = startTableY + COLUMN_HEIGHT * 4 + MARGIN_BOTTOM;
  doc.y = tableEndYPosition;
  addTableInfo(
    doc,
    documentStruct,
    userData.andereErsatzverbindungBeschreibung ?? "",
  );

  const tableSect2 = doc.struct("Sect");

  const table2 = doc.struct("Table", {});

  drawDelayTable(doc, table2, startTableY, userData);

  tableSect2.add(table2); // Add the table to the section
  documentStruct.add(tableSect2); // Add the section to the parent structure
  doc.fill("black"); // Fill black due next pages of the table
  // Get end position of the table generated
  const tableEndYPosition2 = startTableY + COLUMN_HEIGHT * 4 + MARGIN_BOTTOM;
  doc.y = tableEndYPosition2;
  addTableInfo(
    doc,
    documentStruct,
    userData.andereErsatzverbindungBeschreibung ?? "",
  );
}
