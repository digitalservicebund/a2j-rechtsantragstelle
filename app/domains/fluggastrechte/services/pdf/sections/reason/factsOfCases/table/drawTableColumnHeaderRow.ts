import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FluggastrechtBereichType } from "~/domains/fluggastrechte/vorabcheck/userData";
import { addAttributeToTableCell } from "./addAttributeToTableCell";
import { addCellText } from "./addCellText";
import { drawCell } from "./drawCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "./tableConfigurations";

const CONNECTION_REPLACEMENT: Record<string, string> = {
  flug: "anderer Flug",
  etwasAnderes: "Bahn, Bus o.ä.",
  keineAnkunft: "gar nicht angekommen",
  gleicherFlug: "gleicher Flug",
  anderes: "",
};

const DELAY_STATUS: Record<FluggastrechtBereichType, string> = {
  verspaetet: "Verspätung",
  nichtbefoerderung: "Nicht-Beförderung",
  annullierung: "Annullierung",
  anderes: "",
};

function getActualConnectionType(userData: FluggastrechteUserData): string {
  if (userData.tatsaechlicherFlug === "yes")
    return CONNECTION_REPLACEMENT.gleicherFlug;
  return (
    CONNECTION_REPLACEMENT[userData.ersatzverbindungArt ?? "anderes"] ?? ""
  );
}

function getDelayType(userData: FluggastrechteUserData): string {
  return DELAY_STATUS[userData.bereich as FluggastrechtBereichType] ?? "";
}

export function drawTableColumnHeaderRow(
  doc: PDFKit.PDFDocument,
  table: PDFKit.PDFStructureElement,
  startTableY: number,
  userData: FluggastrechteUserData,
) {
  const { bereich } = userData;

  const headers = [
    { title: "Geplante Zeiten", subtitle: "laut Ticket" },
    {
      title:
        bereich === "annullierung"
          ? "Angebotene Ersatzverbindung"
          : "Tatsächliche Zeiten",
      subtitle: getActualConnectionType(userData),
    },
    { title: getDelayType(userData), subtitle: "" },
  ];

  const headerRow = doc.struct("TR");
  // Top-left empty corner cell
  headerRow.add(doc.struct("TD"));

  headers.forEach(({ title, subtitle }, colIndex) => {
    const xPosition = START_TABLE_X + COLUMN_WIDTH * (colIndex + 1);

    drawCell(doc, {
      xPosition,
      yPosition: startTableY,
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      shouldAddSilverBackground: true,
    });

    const headerCell = doc.struct("TH", {}, () => {
      addCellText(doc, {
        xPosition,
        yPosition: startTableY,
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT,
        boldText: title,
        regularText: subtitle,
        regularTextFontSize: 8,
        shouldAddSilverBackground: true,
        textAlign: "center",
      });
    });

    addAttributeToTableCell(doc, headerCell, {
      O: "Table",
      Scope: "Row",
    });

    headerRow.add(headerCell);
  });

  const tableHead = doc.struct("THead");
  tableHead.add(headerRow);
  table.add(tableHead);
}
