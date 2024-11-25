import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import type { FluggastrechtBereichType } from "~/domains/fluggastrechte/vorabcheck/context";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
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

const getTextTelefonNumber = (telefonnummer?: string) => {
  if (typeof telefonnummer === "undefined" || telefonnummer.length === 0) {
    return "";
  }

  return `, Telefonnummer ${telefonnummer}`;
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
    .font(FONTS_BUNDESSANS_BOLD)
    .text("1. ", PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT - 5, undefined, {
      continued: true,
    })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(
      `Die klagende Partei ${getFullPlaintiffName(userData.anrede, userData.title, userData.vorname, userData.nachname)}`,
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
        telefonnummer,
      },
      index,
    ) => {
      doc
        .font(FONTS_BUNDESSANS_BOLD)
        .text(`${index + 2}. `, {
          continued: true,
        })
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${getFullPlaintiffName(anrede, title, vorname, nachname)}, ${strasseHausnummer}, ${plz} ${ort}${getTextTelefonNumber(telefonnummer)}${getTextBookingNumber(buchungsnummer)}`,
        );
    },
  );

  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
};
