import type PDFDocument from "pdfkit";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const OTHER_DETAILS_ITINERARY = "Weitere Angaben zum Reiseverlauf:";

export const addOtherDetailsItinerary = (
  doc: typeof PDFDocument,
  zusaetzlicheAngaben?: string,
) => {
  if (
    typeof zusaetzlicheAngaben !== "undefined" &&
    zusaetzlicheAngaben.length > 0
  ) {
    const otherDetailsItineraryHeight = doc.heightOfString(
      OTHER_DETAILS_ITINERARY,
      {
        width: PDF_WIDTH_SEIZE,
      },
    );

    const zusaetzlicheAngabenHeight = doc.heightOfString(zusaetzlicheAngaben, {
      width: PDF_WIDTH_SEIZE,
    });

    addNewPageInCaseMissingVerticalSpace(
      doc,
      zusaetzlicheAngabenHeight + otherDetailsItineraryHeight,
    );

    doc
      .text(OTHER_DETAILS_ITINERARY, PDF_MARGIN_HORIZONTAL)
      .text(zusaetzlicheAngaben)
      .moveDown(MARGIN_BETWEEN_SECTIONS);
  }
};
