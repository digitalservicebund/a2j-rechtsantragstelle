import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { drawCell } from "./drawCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "./tableConfigurations";

type FluggastrechteDelayType =
  | "verspaetet"
  | "nichtbefoerderung"
  | "annullierung";

const CONNECTION_REPLACEMENT = {
  flug: "anderer Flug",
  etwasAnderes: "Bahn, Bus o.ä.",
  keineAnkunft: "gar nicht angekommen",
  gleicherFlug: "gleicher Flug",
};

const DELAY_STATUS = {
  verspaetet: "Verspätung",
  nichtbefoerderung: "Nicht-Beförderung",
  annullierung: "Annullierung",
};

const getActualConnectionType = (userData: FluggastrechtContext) => {
  if (userData.tatsaechlicherFlug === "yes")
    return CONNECTION_REPLACEMENT.gleicherFlug;
  return userData.ersatzverbindungArt
    ? CONNECTION_REPLACEMENT[userData.ersatzverbindungArt]
    : "";
};

const getDelayType = (userData: FluggastrechtContext): string =>
  DELAY_STATUS[userData.bereich as FluggastrechteDelayType] || "";

export function drawTableRowHead(
  doc: PDFKit.PDFDocument,
  tableStruct: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechtContext,
) {
  const headers = [
    { title: "Geplante Zeiten", subtitle: "(laut Ticket)" },
    {
      title: "Tatsächliche Zeiten",
      subtitle: getActualConnectionType(userData),
    },
    { title: getDelayType(userData), subtitle: "" },
  ];

  const tableHeaderRow = doc.struct("TR"); // Create a new TR for the row
  headers.forEach(({ title, subtitle }, index) => {
    const headerCell = doc.struct("TH"); // Create a new TH for each header cell
    headerCell.add(
      doc.struct("Span", {}, () => {
        drawCell(doc, {
          xPosition: START_TABLE_X + COLUMN_WIDTH * (index + 1), // Dynamic X position based on the column
          yPosition: startTableY,
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
