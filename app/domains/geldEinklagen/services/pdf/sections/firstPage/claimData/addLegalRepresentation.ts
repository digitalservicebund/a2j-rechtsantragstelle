import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import capitalize from "lodash/capitalize";

const SEPARATOR = " | ";
const REPRESENTATION_LEGAL_TEXT = "Anwaltliche Vertretung:";

const getRepresentationName = (userData: GeldEinklagenFormularUserData) => {
  const {
    klagendePersonAnwaltschaftKanzlei,
    klagendePersonAnwaltschaftAnrede,
    klagendePersonAnwaltschaftNachname,
    klagendePersonAnwaltschaftTitle,
    klagendePersonAnwaltschaftVorname,
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
  ]
    .filter(Boolean)
    .join(" ");
};

export const addLegalRepresentation = (
  doc: PDFKit.PDFDocument,
  userData: GeldEinklagenFormularUserData,
) => {
  if (userData.anwaltschaft === "no") {
    return;
  }

  const representationName = getRepresentationName(userData);
  const address = userData.klagendePersonAnwaltschaftStrasseHausnummer ?? "";
  const zipCode = userData.klagendePersonAnwaltschaftPlz ?? "";
  const city = userData.klagendePersonAnwaltschaftOrt ?? "";
  const businessIdentification =
    userData.klagendePersonAnwaltschaftGeschaeftszeichen
      ? `Geschäftszeichen: ${userData.klagendePersonAnwaltschaftGeschaeftszeichen}`
      : "";
  const contactInfo = [
    userData.klagendePersonAnwaltschaftTelefonnummer,
    userData.klagendePersonAnwaltschaftEmail,
  ]
    .filter(Boolean)
    .join(` ${SEPARATOR} `);

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
