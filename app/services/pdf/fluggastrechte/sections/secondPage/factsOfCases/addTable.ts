import type PDFDocument from "pdfkit";
import { drawCell } from "./drawCell";
import { PDF_MARGIN } from "../../../createPdfKitDocument";

const startX = PDF_MARGIN + 10; // X position of the table
const startY = 360; // Y position of the table
const cellWidth = [110, 55, 0]; // Widths for each column
const rowHeight = 16;
const doubleRowHeight = rowHeight * 2;

function drawHorizontalTableHead(doc: typeof PDFDocument) {
  const headers = [
    { title: "Geplante Zeiten", subtitle: "(laut Ticket)" },
    { title: "Tatsächliche Zeiten", subtitle: "(gleicher Flug)" },
    { title: "Verspätung", subtitle: "" },
  ];

  headers.forEach(({ title, subtitle }, index) => {
    drawCell(doc, {
      xPosition: startX + cellWidth[0] * (index + 1), // Dynamic X position based on the column
      yPosition: startY,
      width: cellWidth[0], // Each header has the same width
      height: doubleRowHeight, // Same height for all header cells
      boldText: title, // Title (main content)
      normalText: subtitle, // Subtitle (optional)
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });
}

function drawColumnsHeadDateAndTime(
  doc: typeof PDFDocument,
  positionY: number,
) {
  const columns = ["Datum", "Zeit", "Datum", "Zeit"];

  columns.forEach((columnValue, index) => {
    const xPosition = startX + cellWidth[1];
    const yPosition = startY + rowHeight * (positionY + index);

    drawCell(doc, {
      xPosition,
      yPosition,
      width: cellWidth[1],
      height: rowHeight,
      boldText: columnValue,
      normalText: "",
      shouldAddSilverBackground: true,
      textAlign: "left",
    });
  });
}

function drawColumnsValues(doc: typeof PDFDocument, yStartPadding: number) {
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
    drawCell(doc, {
      xPosition,
      yPosition,
      width: cellWidth[0],
      height: rowHeight,
      boldText: "", // No label text, only the value
      normalText: columnValue,
      shouldAddSilverBackground: false,
      textAlign: "center",
      normalTextFontSize: 10,
    });
  }

  drawCell(doc, {
    xPosition: startX + cellWidth[1] * 6 + 30,
    yPosition: startY + rowHeight * (yStartPadding + 1),
    width: cellWidth[1],
    height: rowHeight,
    boldText: "", // No label text, only the value
    normalText: "3 Stunden 34 Minuten",
    shouldAddSilverBackground: false,
    textAlign: "center",
    normalTextFontSize: 10,
    shouldDrawRectangle: false,
  });
}

function drawColumnsHead(doc: typeof PDFDocument, yStartPadding: number) {
  const headers = [
    { title: "Abflug", subtitle: "Startflughafen" },
    { title: "Ankunft", subtitle: "Zielflughafen" },
  ];
  // X for columns
  const xPosition = startX + cellWidth[2];

  // Loop through headers and draw each section
  headers.forEach((header, index) => {
    const yPosition = startY + doubleRowHeight * (index + 1); // Adjust yPosition based on index

    drawCell(doc, {
      xPosition,
      yPosition,
      width: cellWidth[1],
      height: doubleRowHeight,
      boldText: header.title,
      normalText: header.subtitle,
      shouldAddSilverBackground: true,
      textAlign: "left",
    });
  });

  drawColumnsHeadDateAndTime(doc, yStartPadding);
}

export function addTable(doc: typeof PDFDocument) {
  drawHorizontalTableHead(doc);
  drawColumnsHead(doc, 2);
  drawColumnsValues(doc, 2);
}
