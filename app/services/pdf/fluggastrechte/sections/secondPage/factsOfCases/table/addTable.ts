import { PDF_MARGIN } from "~/services/pdf/fluggastrechte/createPdfKitDocument";
import { drawColumnsHead } from "./drawColumnsHead";
import { drawColumnsValues } from "./drawColumnsValues";
import { drawHorizontalTableHead } from "./drawHorizontalTableHead";

export const START_TABLE_X = PDF_MARGIN + 10; // X position of the table
export const START_TABLE_Y = 360; // Y position of the table
export const COLUMN_WIDTH = 110;
export const COLUMN_HEIGHT = 32;

export function addTable(
  doc: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) {
  const tableSect = doc.struct("Sect"); // Create new section for the table
  const table = doc.struct("Table"); // Create new table structure element

  drawHorizontalTableHead(doc, table); // Pass table as parent to avoid reusing `documentStruct`
  drawColumnsHead(doc, table); // Use the table structure element
  drawColumnsValues(doc, table); // Continue with table structure element

  tableSect.add(table); // Add the table to the section
  documentStruct.add(tableSect); // Add the section to the parent structure
}
