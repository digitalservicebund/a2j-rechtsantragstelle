import type PDFDocument from "pdfkit";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { getStartYPosition } from "./getStartYPosition";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const OTHER_DETAILS_ITINERARY = "Weitere Angaben zum Reiseverlauf:";

export const addOtherDetailsItinerary = (
  doc: typeof PDFDocument,
  compensationStartYPosition: number,
  zusaetzlicheAngaben?: string,
) => {
  if (
    typeof zusaetzlicheAngaben !== "undefined" &&
    zusaetzlicheAngaben.length > 0
  ) {
    const zusaetzlicheAngabenHeight = doc.heightOfString(zusaetzlicheAngaben, {
      width: doc.widthOfString(zusaetzlicheAngaben),
    });
    addNewPageInCaseMissingVerticalSpace(doc, zusaetzlicheAngabenHeight);

    doc
      .text(
        OTHER_DETAILS_ITINERARY,
        PDF_MARGIN_HORIZONTAL,
        getStartYPosition(compensationStartYPosition, doc.y), // start to print this text from this line
      )
      .text(zusaetzlicheAngaben)
      .moveDown(MARGIN_BETWEEN_SECTIONS);
  }
};
