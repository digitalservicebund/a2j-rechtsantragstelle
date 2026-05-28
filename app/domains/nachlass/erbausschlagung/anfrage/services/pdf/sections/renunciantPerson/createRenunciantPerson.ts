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
  { dateOfReceipt, weitereAngaben }: NachlassErbausschlagungAnfrageUserData,
) => {
  doc
    .moveDown()
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Kenntnisnahme der Erbenstellung am: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(dateOfReceipt ? toDateString(dateOfReceipt) : " ");

  if (weitereAngaben && weitereAngaben?.length > 0) {
    doc
      .font(FONTS_BUNDESSANS_REGULAR)
      .text("Anmerkung zur Kenntnisnahme: ", { continued: true })
      .font(FONTS_BUNDESSANS_BOLD)
      .text(weitereAngaben);
  }
};

const testatorText = (
  ausschlagendePersonBeziehungZumErblasser: NachlassErbausschlagungAnfrageUserData["ausschlagendePersonBeziehungZumErblasser"],
): string => {
  const responses: Record<string, string> = {
    "mother-father": "Mutter/Vater",
    "daughter-son": "Tochter/Sohn",
    "grandmother-grandfather": "Großmutter/Großvater",
    "granddaughter-grandson": "Enkelin/Enkel",
    "great-grandmother-great-grandfather": "Urgroßmutter/Urgroßvater",
    "sister-brother": "Schwester/Bruder",
    "half-sister-half-brother": "Halbschwester/Halbbruder",
    "niece-nephew": "Nichte/Neffe",
    "aunt-uncle": "Tante/Onkel",
    cousin: "Cousin/Cousine",
    "great-aunt-great-uncle": "Großtante/Großonkel",
    "wife-husband": "Ehefrau/Ehemann",
    "life-partner": "Lebenspartner*in",
    "mother-in-law-father-in-law": "Schwiegermutter/Schwiegervater",
    "sister-in-law-brother-in-law": "Schwägerin/Schwager",
    "daughter-in-law-son-in-law": "Schwiegertochter/Schwiegersohn",
    "stepmother-stepfather": "Stiefmutter/Stiefvater",
    "stepdaughter-stepson": "Stieftochter/Stiefsohn",
    "stepsister-stepbrother": "Stiefschwester/Stiefbruder",
    "foster-child": "Pflegekind",
    "adoptive-mother-adoptive-father": "Pflegemutter/Pflegevater",
    "godmother-godfather": "Patentante/Patenonkel",
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
