import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "../../../../userData";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addDeceasedPersonDetails } from "./addDeceasedPersonDetails";
import { addDeceasedPersonLastStay } from "./addDeceasedPersonLastStay";

const TITLE = "I. Verstorbene Person / Erblasser";

export const createDeceasedPerson = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  const deceasedPersonSection = doc.struct("Sect");

  deceasedPersonSection.add(
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

  const deceasedPersonParagraph = doc.struct("P");
  addDeceasedPersonDetails(doc, deceasedPersonParagraph, userData);
  deceasedPersonSection.add(deceasedPersonParagraph);

  const deceasedPersonLastStaySection = doc.struct("Sect");
  addDeceasedPersonLastStay(doc, deceasedPersonLastStaySection, userData);
  deceasedPersonSection.add(deceasedPersonLastStaySection);

  documentStruct.add(deceasedPersonSection);
};
