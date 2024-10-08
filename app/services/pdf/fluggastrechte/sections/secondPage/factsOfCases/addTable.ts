import { drawCell } from "./drawCell";
import { PDF_MARGIN } from "../../../createPdfKitDocument";

const startX = PDF_MARGIN + 10; // X position of the table
const startY = 360; // Y position of the table
const cellWidth = [110, 55, 0]; // Widths for each column
const rowHeight = 16;
const doubleRowHeight = rowHeight * 2;

function drawHorizontalTableHead(
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
          xPosition: startX + cellWidth[0] * (index + 1), // Dynamic X position based on the column
          yPosition: startY,
          width: cellWidth[0], // Each header has the same width
          height: doubleRowHeight, // Same height for all header cells
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

function drawColumnsValues(
  doc: PDFKit.PDFDocument,
  yStartPadding: number,
  tableStruct: PDFKit.PDFStructureElement,
) {
  const values = [
    "10.03.2024 20:30",
    "10.03.2024 23:45",
    "--",
    "11.03.2024 03:19",
  ];

  const isPlanned = (index: number) => index <= 1; // To distinguish planned vs actual times

  for (let index = 0; index < values.length; index++) {
    const tableValueColumns = doc.struct("TR"); // Create new TR for each set of values

    tableValueColumns.add(
      doc.struct("TD", {}, () => {
        const columnValue = values[index];
        const columnOffset = isPlanned(index) ? 1 : 2; // Planned values go in the second column, actual in the fourth
        const adjustedIndex = isPlanned(index) ? index - 1 : index - 3; // Calculate the row for planned/actual values

        const xPosition = startX + cellWidth[0] * columnOffset;
        const yPosition =
          startY + doubleRowHeight * (yStartPadding + adjustedIndex);

        drawCell(doc, {
          xPosition,
          yPosition,
          width: cellWidth[0],
          height: doubleRowHeight,
          boldText: "", // No label text, only the value
          regularText: columnValue,
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
        xPosition: startX + cellWidth[0] * 3,
        yPosition: startY + doubleRowHeight,
        width: cellWidth[0],
        height: doubleRowHeight * 2,
        boldText: "", // No label text, only the value
        regularText: "12 Stunden 34 Minuten tess",
        shouldAddSilverBackground: false,
        textAlign: "center",
        regularTextFontSize: 10,
        shouldDrawRectangle: false,
      });
    }),
  );
  tableStruct.add(durationRow); // Add the row to the parent structure
}

function drawColumnsHead(
  doc: PDFKit.PDFDocument,
  yStartPadding: number,
  tableStruct: PDFKit.PDFStructureElement,
) {
  const headers = [
    { title: "Abflug Datum, Zeit", subtitle: "Startflughafen" },
    { title: "Ankunft, Zeit", subtitle: "Zielflughafen" },
  ];
  // X for columns
  const xPosition = startX + cellWidth[2];

  // Loop through headers and draw each section
  const tableHeaderRow = doc.struct("TR"); // New TR for the header row
  headers.forEach((header, index) => {
    const headerCell = doc.struct("TH"); // New TH for each header cell
    headerCell.add(
      doc.struct("Span", {}, () => {
        const yPosition = startY + doubleRowHeight * (index + 1); // Adjust yPosition based on index

        drawCell(doc, {
          xPosition,
          yPosition,
          width: cellWidth[0],
          height: doubleRowHeight,
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

export function addTable(
  doc: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) {
  const tableSect = doc.struct("Sect"); // Create new section for the table
  const table = doc.struct("Table"); // Create new table structure element

  drawHorizontalTableHead(doc, table); // Pass table as parent to avoid reusing `documentStruct`
  drawColumnsHead(doc, 2, table); // Use the table structure element
  drawColumnsValues(doc, 2, table); // Continue with table structure element

  tableSect.add(table); // Add the table to the section
  documentStruct.add(tableSect); // Add the section to the parent structure
}
