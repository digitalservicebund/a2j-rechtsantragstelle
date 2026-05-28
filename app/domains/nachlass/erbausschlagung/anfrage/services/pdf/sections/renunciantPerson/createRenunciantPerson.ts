import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { addRenunciantPersonAddress } from "./addRenunciantPersonAddress";
import { addRenunciantPersonDetails } from "./addRenunciantPersonDetails";
import { addRenunciantPersonContactDetails } from "./addRenunciantPersonContactDetails";

const TITLE = "II. Ausschlagende Person";

const addAcknowledgmentDetails = (doc: typeof PDFDocument) => {
  doc
    .moveDown()
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Kenntnisnahme der Erbenstellung am: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(" ")
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Anmerkung zur Kenntnisnahme: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(" ");
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
        .text(userData.ausschlagendePersonBeziehungZumErblasser ?? "");

      addAcknowledgmentDetails(doc);

      addRenunciantPersonAddress(doc, userData);
    }),
  );

  renunciantPersonSection.add(renunciantPersonParagraph);
  addRenunciantPersonContactDetails(doc, renunciantPersonSection, userData);

  documentStruct.add(renunciantPersonSection);

  doc.moveDown();
};
