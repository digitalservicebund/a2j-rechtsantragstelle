import { drawCell } from "./drawCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "./tableConfigurations";

const headers = [
  {
    title: "Flugnummer",
    subtitle: "betroffener Flug",
  },
  {
    title: "Abflug Datum, Zeit",
    subtitle: "Startflughafen",
  },
  {
    title: "Ankunft Datum, Zeit",
    subtitle: "Zielflughafen",
  },
];

export function drawTableColumnsHead(
  doc: PDFKit.PDFDocument,
  tableStruct: PDFKit.PDFStructureElement,
  startTableY: number,
) {
  // Loop through headers and draw each section
  const tableHeaderRow = doc.struct("TR"); // New TR for the header row
  headers.forEach((header, index) => {
    const headerCell = doc.struct("TH"); // New TH for each header cell
    headerCell.add(
      doc.struct("Span", {}, () => {
        const yPosition = startTableY + COLUMN_HEIGHT * (index + 1); // Adjust yPosition based on index
        drawCell(doc, {
          xPosition: START_TABLE_X,
          yPosition,
          width: COLUMN_WIDTH,
          height: COLUMN_HEIGHT,
          boldText: header.title,
          regularText: header.subtitle,
          shouldAddSilverBackground: true,
          textAlign: "left",
        });
      }),
    );
    tableHeaderRow.add(headerCell); // Add each TH to the TR
  });
  tableStruct.add(tableHeaderRow); // Add TR to the parent structure
}
