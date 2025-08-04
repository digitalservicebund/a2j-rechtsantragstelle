import type PDFDocument from "pdfkit";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const OTHER_DETAILS_ITINERARY = "Weitere Angaben zum Reiseverlauf:";

export const addOtherDetailsItinerary = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
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

    const compensationSect = doc.struct("Sect");
    compensationSect.add(
      doc.struct("P", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .fontSize(10)
          .text(OTHER_DETAILS_ITINERARY, PDF_MARGIN_HORIZONTAL)
          .text(zusaetzlicheAngaben)
          .moveDown(MARGIN_BETWEEN_SECTIONS);
      }),
    );
    documentStruct.add(compensationSect);
  }
};
