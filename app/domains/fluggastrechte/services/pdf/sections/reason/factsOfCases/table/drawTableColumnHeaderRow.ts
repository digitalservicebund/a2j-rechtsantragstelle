import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FluggastrechtBereichType } from "~/domains/fluggastrechte/vorabcheck/userData";
import { drawCellBackground, drawCellText } from "./drawCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "./tableConfigurations";

const CONNECTION_REPLACEMENT = {
  flug: "anderer Flug",
  etwasAnderes: "Bahn, Bus o.ä.",
  keineAnkunft: "gar nicht angekommen",
  gleicherFlug: "gleicher Flug",
  anderes: "",
};

const DELAY_STATUS = {
  verspaetet: "Verspätung",
  nichtbefoerderung: "Nicht-Beförderung",
  annullierung: "Annullierung",
  anderes: "",
};

const getActualConnectionType = ({
  tatsaechlicherFlug,
  ersatzverbindungArt,
}: FluggastrechteUserData) => {
  if (tatsaechlicherFlug === "yes") return CONNECTION_REPLACEMENT.gleicherFlug;
  return ersatzverbindungArt ? CONNECTION_REPLACEMENT[ersatzverbindungArt] : "";
};

const getDelayType = ({ bereich }: FluggastrechteUserData): string =>
  DELAY_STATUS[bereich as FluggastrechtBereichType] ?? "";

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
  const cornerCell = doc.struct("TD");

  headerRow.add(cornerCell);

  headers.forEach(({ title, subtitle }, colIndex) => {
    const headerCell = doc.struct("TH", {}, () => {
      drawCellText(doc, {
        xPosition: START_TABLE_X + COLUMN_WIDTH * (colIndex + 1),
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

    drawCellBackground(doc, {
      xPosition: START_TABLE_X + COLUMN_WIDTH * (colIndex + 1),
      yPosition: startTableY,
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      shouldAddSilverBackground: true,
    });

    headerCell.dictionary.data.A = doc.ref({
      O: "Table",
      Scope: "Row",
    });

    headerCell.dictionary.data.A.end();

    headerRow.add(headerCell);
  });

  const tableHead = doc.struct("THead");
  tableHead.add(headerRow);

  table.add(tableHead);
}
