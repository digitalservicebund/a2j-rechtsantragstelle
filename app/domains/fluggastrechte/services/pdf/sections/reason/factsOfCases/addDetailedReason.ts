import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import type { FluggastrechtBereichType } from "~/domains/fluggastrechte/vorabcheck/context";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";
import { getFullPlaintiffName } from "../../getFullPlaintiffName";

export const CONFIRM_BOOKING_TEXT = "Eine bestätigte Buchung liegt vor.";
export const CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT =
  "Bestätigte Buchungen der klagenden Partei und der weiteren Fluggäste liegen vor.";
export const ATTACHMENT_CONFIRM_BOOKING_TEXT =
  "Beweis: Anlage Buchungsbestätigungen";
export const PLAINTIFF_ON_TIME_TEXT =
  "Die klagende Partei war pünktlich zum Check-in und Boarding.";
export const PLAINTIFF_ON_TIME_MULTIPLE_PERSONS_TEXT =
  "Die klagende Partei und die weiteren Fluggäste waren pünktlich zum Check-in und Boarding.";
export const MARGIN_RIGHT = 10;

const bereichMappingText = {
  verspaetet: "Verspätung",
  annullierung: "Annullierung",
  nichtbefoerderung: "Nicht-Beförderung",
  anderes: "",
} as const;

const getFlightTextByBereich = ({
  bereich,
  startAirport,
  endAirport,
}: FluggastrechtContext) => {
  if (bereich === "verspaetet") {
    return `Der Flug von ${getAirportNameByIataCode(startAirport)} nach ${getAirportNameByIataCode(endAirport)} hatte die genannte Verspätung. Aufgrund der Verspätung wurde der Anschlussflug verpasst.`;
  }

  if (bereich === "annullierung") {
    return `Der Flug von ${getAirportNameByIataCode(startAirport)} nach ${getAirportNameByIataCode(endAirport)} wurde annulliert. Aufgrund der Annullierung wurde der Anschlussflug verpasst.`;
  }

  return `Die Nicht-Beförderung fand auf dem Flug von ${getAirportNameByIataCode(startAirport)} nach ${getAirportNameByIataCode(endAirport)} statt. Aufgrund der Nicht-Beförderung wurde der Anschlussflug verpasst.`;
};

const getTextBookingNumber = (buchungsnummer?: string) => {
  if (typeof buchungsnummer === "undefined" || buchungsnummer.length === 0) {
    return "";
  }

  return `, abweichende Buchungsnummer: ${buchungsnummer}`;
};

const addMultiplePersonsText = (
  doc: typeof PDFDocument,
  userData: FluggastrechtContext,
) => {
  if (
    userData.isWeiterePersonen === "no" ||
    !arrayIsNonEmpty(userData.weiterePersonen)
  ) {
    return;
  }

  doc
    .text(
      `Folgende Personen waren von dieser ${bereichMappingText[userData.bereich as FluggastrechtBereichType] ?? ""} betroffen:`,
      PDF_MARGIN_HORIZONTAL,
    )
    .text(
      `1. Die klagende Partei ${getFullPlaintiffName(userData.anrede, userData.title, userData.vorname, userData.nachname)}`,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT - 5,
    );

  userData.weiterePersonen.forEach(
    (
      {
        anrede,
        title,
        nachname,
        vorname,
        buchungsnummer,
        strasseHausnummer,
        ort,
        plz,
      },
      index,
    ) => {
      doc.text(
        `${index + 2}. ${getFullPlaintiffName(anrede, title, vorname, nachname)}, ${strasseHausnummer}, ${plz} ${ort}${getTextBookingNumber(buchungsnummer)}`,
      );
    },
  );

  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
};

const getConfirmationBookingText = ({
  isWeiterePersonen,
}: FluggastrechtContext) => {
  if (isWeiterePersonen === "yes") {
    return CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT;
  }

  return CONFIRM_BOOKING_TEXT;
};

export const addDetailedReason = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const detailedReasonSect = doc.struct("Sect");
  detailedReasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text(getConfirmationBookingText(userData))
        .moveDown(0.5)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          ATTACHMENT_CONFIRM_BOOKING_TEXT,
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

      doc.text(getFlightTextByBereich(userData), PDF_MARGIN_HORIZONTAL);
    }),
  );
  documentStruct.add(detailedReasonSect);
};
