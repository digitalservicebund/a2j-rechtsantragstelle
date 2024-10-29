import { drawCell } from "./drawCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
  START_TABLE_Y,
} from "./tableConfigurations";

export function drawTableRowHead(
  doc: PDFKit.PDFDocument,
  tableStruct: PDFKit.PDFStructureElement,
) {
  const headers = [
    { title: "Geplante Zeiten", subtitle: "(laut Ticket)" },
    { title: "Tatsächliche Zeiten", subtitle: "(gleicher Flug)" },
    { title: "Verspätung", subtitle: "" },
  ];

  const tableHeaderRow = doc.struct("TR"); // Create a new TR for the row
  headers.forEach(({ title, subtitle }, index) => {
    const headerCell = doc.struct("TH"); // Create a new TH for each header cell
    headerCell.add(
      doc.struct("Span", {}, () => {
        drawCell(doc, {
          xPosition: START_TABLE_X + COLUMN_WIDTH * (index + 1), // Dynamic X position based on the column
          yPosition: START_TABLE_Y,
          width: COLUMN_WIDTH, // Each header has the same width
          height: COLUMN_HEIGHT, // Same height for all header cells
          boldText: title, // Title (main content)
          regularText: subtitle, // Subtitle (optional)
          shouldAddSilverBackground: true,
          textAlign: "center",
        });
      }),
    );
    tableHeaderRow.add(headerCell); // Add each TH to the TR
  });
  tableStruct.add(tableHeaderRow); // Add the TR to the parent structure
}
