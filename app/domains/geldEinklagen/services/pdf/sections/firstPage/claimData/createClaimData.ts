import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { addPlaintiffDetails } from "./addPlaintiffDetails";
import type {
  GeldEinklagenFormularUserData,
  GeldEinklagenSachgebietType,
} from "~/domains/geldEinklagen/formular/userData";
import { addAccusedDetails } from "./addAccusedDetails";

const IN_THE_MATTER = "in der Sache";
const AGAINST = "gegen";

const MAIN_TITLE = "Klage";
const MAIN_SUBTITLE =
  "im Online-Verfahren nach Paragraf 1124 Absatz 1 Nummer 1 der Zivilprozessordnung";

const DUE_REASON_TEXT = "Wegen: Zahlungsklage";

const subjectAreaMapping = {
  miete: "Miete & Pacht",
  versicherung: "Versicherung",
  schaden: "Schaden durch unerlaubte Handlung",
  reisen: "Reisen & Beförderung",
  verkehrsunfall: "Verkehrsunfall",
  urheberrecht: "Urheberrecht",
  anderesRechtsproblem: "Ich habe ein anderes Rechtsproblem",
};

export const createClaimData = (
  doc: typeof PDFDocument,
  moneyCompensationClaimSection: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  moneyCompensationClaimSection.add(
    doc.struct("H1", {}, () => {
      doc
        .fontSize(31)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(MAIN_TITLE, { align: "left" });
      doc.fontSize(10).font(FONTS_BUNDESSANS_REGULAR).text(MAIN_SUBTITLE);
      doc.moveDown(2);
    }),
  );

  moneyCompensationClaimSection.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(IN_THE_MATTER);
      doc.moveDown();
    }),
  );

  moneyCompensationClaimSection.add(
    doc.struct("P", {}, () => {
      addPlaintiffDetails(doc, userData);
      doc.moveDown();
    }),
  );

  moneyCompensationClaimSection.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(AGAINST, { align: "left" })
        .moveDown();
    }),
  );

  moneyCompensationClaimSection.add(
    doc.struct("P", {}, () => {
      addAccusedDetails(doc, userData);
      doc.moveDown();
    }),
  );

  const subjectAreaDescription =
    subjectAreaMapping[
      (userData.sachgebiet as GeldEinklagenSachgebietType) ?? ""
    ];

  moneyCompensationClaimSection.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(`${DUE_REASON_TEXT} - ${subjectAreaDescription}`)
        .text(`Streitwert: Euro`);
    }),
  );
};
