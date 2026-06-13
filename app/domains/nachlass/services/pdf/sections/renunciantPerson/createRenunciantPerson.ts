import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { addRenunciantPersonAddress } from "./addRenunciantPersonAddress";
import { addRenunciantPersonDetails } from "./addRenunciantPersonDetails";
import { addRenunciantPersonContactDetails } from "./addRenunciantPersonContactDetails";
import { toDateString } from "~/services/validation/dateObject";

const TITLE = "II. Ausschlagende Person";

const addAcknowledgmentDetails = (
  doc: typeof PDFDocument,
  {
    awarenessDate,
    awarenessDateRemarks,
  }: NachlassErbausschlagungAnfrageUserData,
) => {
  doc
    .moveDown()
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Kenntnisnahme der Erbenstellung am: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(awarenessDate ? toDateString(awarenessDate) : " ");

  if (awarenessDateRemarks && awarenessDateRemarks?.length > 0) {
    doc
      .font(FONTS_BUNDESSANS_REGULAR)
      .text("Anmerkung zum Datum: ", { continued: true })
      .font(FONTS_BUNDESSANS_BOLD)
      .text(awarenessDateRemarks);
  }
};

const testatorText = (
  ausschlagendePersonBeziehungZumErblasser: NachlassErbausschlagungAnfrageUserData["ausschlagendePersonBeziehungZumErblasser"],
): string => {
  const responses: Record<string, string> = {
    "not-related": "Nicht verwandt",
    "wife-husband": "Ehefrau/Ehemann",
    "life-partner": "Lebenspartner*in",
    "daughter-son": "Tochter/Sohn",
    "granddaughter-grandson": "Enkelin/Enkel",
    "mother-father": "Mutter/Vater",
    "sister-brother": "Schwester/Bruder",
    "half-sister-half-brother": "Halbschwester/Halbbruder",
    "niece-nephew": "Nichte/Neffe",
    "grandmother-grandfather": "Großmutter/Großvater",
    "aunt-uncle": "Tante/Onkel",
    cousin: "Cousin/Cousine",
    "great-grandmother-great-grandfather": "Urgroßmutter/Urgroßvater",
    "great-aunt-great-uncle": "Großtante/Großonkel",
    "adoptive-mother-adoptive-father": "Pflegemutter/Pflegevater",
    "adoptive-daughter-adoptive-son": "Adoptivtochter/Adoptivsohn",
    other: "Sonstiges",
  };
  return responses[ausschlagendePersonBeziehungZumErblasser ?? ""] ?? "";
};

export const createRenunciantPerson = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  const renunciantPersonSection = doc.struct("Sect");

  renunciantPersonSection.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(16)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(TITLE, {
          align: "left",
        })
        .fontSize(10)
        .moveDown(1);
    }),
  );

  const renunciantPersonParagraph = doc.struct("P");

  renunciantPersonParagraph.add(
    doc.struct("Span", {}, () => {
      addRenunciantPersonDetails(doc, userData);

      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Familienverhältnis zum Erblasser: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(testatorText(userData.ausschlagendePersonBeziehungZumErblasser));

      addAcknowledgmentDetails(doc, userData);

      addRenunciantPersonAddress(doc, userData);
    }),
  );

  renunciantPersonSection.add(renunciantPersonParagraph);
  addRenunciantPersonContactDetails(doc, renunciantPersonSection, userData);

  documentStruct.add(renunciantPersonSection);

  doc.moveDown();
};
