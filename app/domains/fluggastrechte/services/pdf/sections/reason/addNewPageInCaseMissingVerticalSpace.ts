import type PDFDocument from "pdfkit";
import { PDF_HEIGHT_SEIZE } from "~/services/pdf/createPdfKitDocument";

const MAX_VERTICAL_SPACE = PDF_HEIGHT_SEIZE - 70;
//doc.moveDown(1) moves down 20 dpi
const DEFAULT_MOVE_DOWN = 20;

type PageBreakParams = {
  extraYPosition?: number;
  moveDownFactor?: number;
  numberOfParagraphs?: number;
};

export const addNewPageInCaseMissingVerticalSpace = (
  doc: typeof PDFDocument,
  {
    extraYPosition = 0,
    moveDownFactor = 0,
    numberOfParagraphs = 0,
  }: PageBreakParams,
): void => {
  if (
    doc.y +
      extraYPosition +
      //doc.moveDown(x) and paragraphs create vertical space, e.g. doc.moveDown(2) and 0 paragraphs-> (2+0)*20dpi
      (moveDownFactor + numberOfParagraphs) * DEFAULT_MOVE_DOWN >=
    MAX_VERTICAL_SPACE
  ) {
    doc.addPage();
  }
};
