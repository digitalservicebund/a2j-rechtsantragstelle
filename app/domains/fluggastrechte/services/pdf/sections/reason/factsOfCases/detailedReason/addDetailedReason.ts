import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import {
  MARGIN_BETWEEN_SECTIONS,
  MARGIN_RIGHT,
} from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addFlightTextArea } from "./addFlightTextArea";
import { addMultiplePersonsText } from "./addMultiplePersonsText";

export const CONFIRM_BOOKING_TEXT = "Eine bestätigte Buchung liegt vor.";
export const CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT =
  "Bestätigte Buchungen der klagenden Partei und der weiteren Fluggäste liegen vor.";
export const ATTACHMENT_CONFIRM_BOOKING_TEXT =
  "Beweis: Anlage Buchungsbetätigung";
export const ATTACHMENT_CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT =
  "Beweis: Anlage Buchungsbestätigungen";
export const PLAINTIFF_ON_TIME_TEXT =
  "Die klagende Partei war pünktlich zum Check-in und Boarding.";
export const PLAINTIFF_ON_TIME_MULTIPLE_PERSONS_TEXT =
  "Die klagende Partei und die weiteren Fluggäste waren pünktlich zum Check-in und Boarding.";

const getConfirmationBookingTexts = ({
  isWeiterePersonen,
}: FluggastrechtContext) => {
  if (isWeiterePersonen === "yes") {
    return {
      confirmationBooking: CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT,
      attachmentConfirmationBooking:
        ATTACHMENT_CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT,
    };
  }

  return {
    confirmationBooking: CONFIRM_BOOKING_TEXT,
    attachmentConfirmationBooking: ATTACHMENT_CONFIRM_BOOKING_TEXT,
  };
};

export const addDetailedReason = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const detailedReasonSect = doc.struct("Sect");

  const { attachmentConfirmationBooking, confirmationBooking } =
    getConfirmationBookingTexts(userData);

  detailedReasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text(confirmationBooking)
        .moveDown(0.5)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          attachmentConfirmationBooking,
          PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
        )
        .font(FONTS_BUNDESSANS_REGULAR)
        .moveDown(MARGIN_BETWEEN_SECTIONS);

      addMultiplePersonsText(doc, userData);

      if (userData.bereich !== "annullierung") {
        doc.text(
          userData.isWeiterePersonen === "no"
            ? PLAINTIFF_ON_TIME_TEXT
            : PLAINTIFF_ON_TIME_MULTIPLE_PERSONS_TEXT,
          PDF_MARGIN_HORIZONTAL,
        );
      }

      addFlightTextArea(doc, userData);
    }),
  );
  documentStruct.add(detailedReasonSect);
};
