import _ from "lodash";
import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/fluggastrechte/createPdfKitDocument";

export const PLAINTIFF_TEXT = "– Klagende Partei –";
export const SEPARATOR = " | ";

const getFullPlaintiffName = (userData: FluggastrechtContext) => {
  const { anrede, title, vorname, nachname } = userData;

  const mappedTitle = title === "dr" ? "Dr." : title;
  const capitalizedVorname = _.capitalize(vorname);

  return [anrede, mappedTitle, capitalizedVorname, nachname]
    .filter(Boolean)
    .join(" ");
};

export const addPlaintiffDetails = (
  doc: typeof PDFDocument,
  userData: FluggastrechtContext,
) => {
  const plaintiffName = getFullPlaintiffName(userData);
  const address = userData.strasseHausnummer ?? "";
  const phoneNumber = userData.telefonnummer ?? "";
  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(plaintiffName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(address)
    .text(phoneNumber)
    .text(PLAINTIFF_TEXT, { align: "left" });
};
