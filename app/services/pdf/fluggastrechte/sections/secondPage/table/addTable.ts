import { drawTableColumnsHead } from "./drawTableColumnHead";
import { drawTableColumnsValues } from "./drawTableColumnsValues";
import { drawTableRowHead } from "./drawTableRowHead";

export function addTable(
  doc: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) {
  const tableSect = doc.struct("Sect"); // Create new section for the table
  const table = doc.struct("Table"); // Create new table structure element

  drawTableRowHead(doc, table); // Pass table as parent to avoid reusing `documentStruct`
  drawTableColumnsHead(doc, table); // Use the table structure element
  drawTableColumnsValues(doc, table); // Continue with table structure element

  tableSect.add(table); // Add the table to the section
  documentStruct.add(tableSect); // Add the section to the parent structure
}
