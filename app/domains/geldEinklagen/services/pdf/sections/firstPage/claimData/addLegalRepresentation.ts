import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import capitalize from "lodash/capitalize";

export const SEPARATOR = " | ";
const REPRESENTATION_LEGAL_TEXT = "Anwaltliche Vertretung:";

const getRepresentationName = (userData: GeldEinklagenFormularUserData) => {
  const {
    klagendePersonAnwaltschaftKanzlei,
    klagendePersonAnwaltschaftAnrede,
    klagendePersonAnwaltschaftNachname,
    klagendePersonAnwaltschaftTitle,
    klagendePersonAnwaltschaftVorname,
    klagendePersonAnwaltschaftBerufsbezeichnung,
  } = userData;

  const salutation =
    klagendePersonAnwaltschaftAnrede === "none"
      ? ""
      : capitalize(klagendePersonAnwaltschaftAnrede);
  const capitalizedVorname = capitalize(klagendePersonAnwaltschaftVorname);

  return [
    klagendePersonAnwaltschaftKanzlei
      ? `${klagendePersonAnwaltschaftKanzlei},`
      : "",
    salutation,
    klagendePersonAnwaltschaftTitle,
    capitalizedVorname,
    klagendePersonAnwaltschaftNachname,
    klagendePersonAnwaltschaftBerufsbezeichnung,
  ]
    .filter(Boolean)
    .join(" ");
};

const formatContactInfo = (phone?: string, email?: string): string => {
  const parts = [phone, email].filter(Boolean);
  return parts.join(` ${SEPARATOR} `);
};

export const addLegalRepresentation = (
  doc: typeof PDFDocument,
  userData: GeldEinklagenFormularUserData,
) => {
  if (userData.anwaltschaft === "no") {
    return;
  }

  const representationName = getRepresentationName(userData);
  const address = userData.klagendePersonAnwaltschaftStrasseHausnummer ?? "";
  const zipCode = userData.klagendePersonAnwaltschaftPlz ?? "";
  const city = userData.klagendePersonAnwaltschaftOrt ?? "";
  const businessIdentification = userData.klagendePersonAnwaltschaftKanzlei
    ? `Geschäftszeichen: ${userData.klagendePersonAnwaltschaftKanzlei}`
    : "";
  const contactInfo =
    formatContactInfo(
      userData.klagendePersonAnwaltschaftTelefonnummer,
      userData.klagendePersonAnwaltschaftEmail,
    ) || "";

  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(REPRESENTATION_LEGAL_TEXT)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(representationName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(`${address}, ${zipCode} ${city}, Deutschland`)
    .text(businessIdentification)
    .text(contactInfo);
};
