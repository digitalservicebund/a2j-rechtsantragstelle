import type PDFDocument from "pdfkit";
import { drawCell } from "./drawCell";
import { PDF_MARGIN } from "../../../createPdfKitDocument";

const startX = PDF_MARGIN + 10; // X position of the table
const startY = 360; // Y position of the table
const cellWidth = [110, 55, 0]; // Widths for each column
const rowHeight = 16;
const doubleRowHeight = rowHeight * 2;

function drawHorizontalTableHead(
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) {
  const headers = [
    { title: "Geplante Zeiten", subtitle: "(laut Ticket)", padding: 20 },
    { title: "Tatsächliche Zeiten", subtitle: "(gleicher Flug)", padding: 10 },
    { title: "Verspätung", subtitle: "", padding: 25 },
  ];

  headers.forEach(({ title, padding, subtitle }, index) => {
    drawCell(
      doc,
      startX + cellWidth[0] * (index + 1), // Dynamic X position based on the column
      startY,
      cellWidth[0], // Each header has the same width
      doubleRowHeight, // Same height for all header cells
      title, // Title (main content)
      subtitle, // Subtitle (optional)
      bundesSansWebRegular, // Regular font for subtitle
      bundesSansWebBold, // Bold font for title
      padding, // Custom padding for each cell
    );
  });
}

function drawColumnsHeadDateAndTime(
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
  positionY: number,
) {
  const columns = ["Datum", "Zeit", "Datum", "Zeit"];

  columns.forEach((columnValue, index) => {
    const xPosition = startX + cellWidth[1];
    const yPosition = startY + rowHeight * (positionY + index);

    drawCell(
      doc,
      xPosition,
      yPosition,
      cellWidth[1],
      rowHeight,
      columnValue,
      "",
      bundesSansWebRegular,
      bundesSansWebBold,
    );
  });
}

function drawColumnsValues(
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
  yStartPadding: number,
) {
  const values = [
    "10.03.2024",
    "20:30",
    "10.03.2024",
    "23:45",
    "--",
    "--",
    "11.03.2024",
    "03:19",
  ];

  const isPlanned = (index: number) => index <= 3; // To distinguish planned vs actual times

  for (let index = 0; index < values.length; index++) {
    const columnValue = values[index];

    const columnOffset = isPlanned(index) ? 2 : 4; // Planned values go in the second column, actual in the fourth
    const adjustedIndex = isPlanned(index) ? index : index - 4; // Calculate the row for planned/actual values

    const xPosition = startX + cellWidth[1] * columnOffset;
    const yPosition = startY + rowHeight * (yStartPadding + adjustedIndex);

    // Draw the cell with the value
    drawCell(
      doc,
      xPosition,
      yPosition,
      cellWidth[0],
      rowHeight,
      "", // No label text, only the value
      columnValue,
      bundesSansWebRegular,
      bundesSansWebBold,
      30, // Padding or margin
    );
  }
}

function drawColumnsHead(
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
  yStartPadding: number,
) {
  const headers = [
    { title: "Abflug", subtitle: "Startflughafen" },
    { title: "Ankunft", subtitle: "Zielflughafen" },
  ];
  // X for columns
  const xPosition = startX + cellWidth[2];

  // Loop through headers and draw each section
  headers.forEach((header, index) => {
    const yPosition = startY + doubleRowHeight * (index + 1); // Adjust yPosition based on index

    drawCell(
      doc,
      xPosition, // X position stays constant
      yPosition, // Dynamic Y position
      cellWidth[1], // Fixed width for the column
      doubleRowHeight, // Height remains constant
      header.title, // Title (Abflug / Ankunft)
      header.subtitle, // Subtitle (Startflughafen / Zielflughafen)
      bundesSansWebRegular,
      bundesSansWebBold,
    );
  });

  drawColumnsHeadDateAndTime(
    doc,
    bundesSansWebRegular,
    bundesSansWebBold,
    yStartPadding,
  );
}

export function addTable(
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) {
  drawHorizontalTableHead(doc, bundesSansWebRegular, bundesSansWebBold);
  drawColumnsHead(doc, bundesSansWebRegular, bundesSansWebBold, 2);
  drawColumnsValues(doc, bundesSansWebRegular, bundesSansWebBold, 2);
}
