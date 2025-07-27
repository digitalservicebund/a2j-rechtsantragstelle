import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import {
  MARGIN_BETWEEN_SECTIONS,
  MARGIN_RIGHT,
} from "~/domains/fluggastrechte/services/pdf/configurations";
import type { FluggastrechtBereichType } from "~/domains/fluggastrechte/vorabcheck/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";
import { getFullPlaintiffName } from "../../../getFullPlaintiffName";

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
  userData: FluggastrechteUserData,
  reasonSect: PDFKit.PDFStructureElement,
) => {
  if (
    userData.isWeiterePersonen === "no" ||
    !arrayIsNonEmpty(userData.weiterePersonen)
  ) {
    return;
  }

  reasonSect.add(
    doc.struct("P", {}, () => {
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
      if (userData.weiterePersonen?.length === 1) {
        const weiterePerson = userData.weiterePersonen[0];
        doc
          .font(FONTS_BUNDESSANS_BOLD)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(
            `${getFullPlaintiffName(weiterePerson.anrede, weiterePerson.title, weiterePerson.vorname, weiterePerson.nachname)}, ${weiterePerson.strasseHausnummer}, ${weiterePerson.plz} ${weiterePerson.ort}, ${weiterePerson.land}${getTextTelefonNumber(weiterePerson.telefonnummer)}${getTextBookingNumber(weiterePerson.buchungsnummer)}`,
          );
      }
    }),
  );

  if (userData.weiterePersonen.length > 1) {
    const weiterePersonenList = doc.struct("L");
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
          land,
        },
        index,
      ) => {
        const weiterePersonenListItem = doc.struct("LI");
        weiterePersonenListItem.add(
          doc.struct("LBody", {}, () => {
            doc
              .font(FONTS_BUNDESSANS_BOLD)
              .text(`${index + 2}. `, {
                continued: true,
              })
              .font(FONTS_BUNDESSANS_REGULAR)
              .text(
                `${getFullPlaintiffName(anrede, title, vorname, nachname)}, ${strasseHausnummer}, ${plz} ${ort}, ${land}${getTextTelefonNumber(telefonnummer)}${getTextBookingNumber(buchungsnummer)}`,
              );
          }),
        );
        weiterePersonenList.add(weiterePersonenListItem);
      },
    );
    reasonSect.add(weiterePersonenList);
  }
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
};
