import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { addTableInfo } from "./addTableInfo";
import { drawTableColumnsHead } from "./drawTableColumnHead";
import { drawTableColumnsValues } from "./drawTableColumnsValues";
import { drawTableRowHead } from "./drawTableRowHead";
import { COLUMN_HEIGHT, MARGIN_BOTTOM } from "./tableConfigurations";

export function addTable(
  doc: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechtContext,
) {
  const tableSect = doc.struct("Sect"); // Create new section for the table
  const table = doc.struct("Table"); // Create new table structure element

  drawTableRowHead(doc, table, startTableY, userData); // Pass table as parent to avoid reusing `documentStruct`
  drawTableColumnsHead(doc, table, startTableY); // Use the table structure element
  drawTableColumnsValues(doc, table, startTableY, userData); // Continue with table structure element

  tableSect.add(table); // Add the table to the section
  documentStruct.add(tableSect); // Add the section to the parent structure
  doc.fill("black"); // Fill black due next pages of the table

  // Set tableEndYPosition based on the existence of `andereErsatzverbindungBeschreibung`
  const tableEndYPosition = startTableY + COLUMN_HEIGHT * 4 + MARGIN_BOTTOM;
  addTableInfo(
    doc,
    documentStruct,
    userData.andereErsatzverbindungBeschreibung ?? "",
    tableEndYPosition,
  );
}
