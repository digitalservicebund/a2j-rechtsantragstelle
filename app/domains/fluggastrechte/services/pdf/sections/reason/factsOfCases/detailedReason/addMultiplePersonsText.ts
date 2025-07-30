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
  documentStruct: PDFKit.PDFStructureElement,
) => {
  if (
    userData.isWeiterePersonen === "no" ||
    !arrayIsNonEmpty(userData.weiterePersonen)
  ) {
    return;
  }

  const weiterePersonenSect = doc.struct("Sect");
  const weiterePersonenList = doc.struct("L");
  weiterePersonenList.add(
    doc.struct("Caption", {}, () => {
      doc.text(
        `Folgende Personen waren von dieser ${bereichMappingText[userData.bereich as FluggastrechtBereichType] ?? ""} betroffen:`,
        PDF_MARGIN_HORIZONTAL,
      );
      doc.moveDown(0.5);
    }),
  );
  const klagendePersonListItem = doc.struct("LI");
  klagendePersonListItem.add(
    doc.struct("LBody", {}, () => {
      doc
        .text("1. ", PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT - 5, undefined, {
          continued: true,
        })
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `Die klagende Partei ${getFullPlaintiffName(userData.anrede, userData.title, userData.vorname, userData.nachname)}`,
        );
      doc.moveDown(0.5);
    }),
  );
  weiterePersonenList.add(klagendePersonListItem);
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
          doc.moveDown(0.5);
        }),
      );
      weiterePersonenList.add(weiterePersonenListItem);
    },
  );
  weiterePersonenSect.add(weiterePersonenList);

  documentStruct.add(weiterePersonenSect);
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
};
