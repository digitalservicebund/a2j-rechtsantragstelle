import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FluggastrechtBereichType } from "~/domains/fluggastrechte/vorabcheck/userData";
import { drawCell } from "./drawCell";
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
    //{ title: getDelayType(userData), subtitle: "" },
  ];

  const headerRow = doc.struct("TR");
  // Top-left empty corner cell
  const cornerCell = doc.struct("TH");
  cornerCell.add(
    doc.struct("Span", {}, () => {
      drawCell(doc, {
        xPosition: START_TABLE_X,
        yPosition: startTableY,
        width: COLUMN_WIDTH,
        height: COLUMN_HEIGHT,
        boldText: "",
        regularText: "",
        shouldAddSilverBackground: true,
        textAlign: "center",
      });
    }),
  );
  headerRow.add(cornerCell);

  headers.forEach(({ title, subtitle }, colIndex) => {
    const headerCell = doc.struct("TH");

    headerCell.add(
      doc.struct("Span", {}, () => {
        drawCell(doc, {
          xPosition: START_TABLE_X + COLUMN_WIDTH * (colIndex + 1),
          yPosition: startTableY,
          width: COLUMN_WIDTH,
          height: COLUMN_HEIGHT,
          boldText: title,
          regularText: subtitle,
          shouldAddSilverBackground: true,
          textAlign: "center",
        });
      }),
    );
    headerRow.add(headerCell);
  });

  table.add(headerRow);
}
