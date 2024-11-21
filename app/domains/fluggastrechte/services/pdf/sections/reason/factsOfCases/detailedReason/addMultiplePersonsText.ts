import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import type { FluggastrechtBereichType } from "~/domains/fluggastrechte/vorabcheck/context";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";
import { getFullPlaintiffName } from "../../../getFullPlaintiffName";

export const MARGIN_RIGHT = 10;

const bereichMappingText = {
  verspaetet: "Verspätung",
  annullierung: "Annullierung",
  nichtbefoerderung: "Nicht-Beförderung",
  anderes: "",
} as const;

const getTextBookingNumber = (buchungsnummer?: string) => {
  if (typeof buchungsnummer === "undefined" || buchungsnummer.length === 0) {
    return "";
  }

  return `, abweichende Buchungsnummer: ${buchungsnummer}`;
};

export const addMultiplePersonsText = (
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
