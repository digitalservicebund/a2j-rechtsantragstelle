import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";

const TITLE = "III. Kinder der ausschlagenden Person";

export const createChildrenOfRenunciantPerson = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  if (userData.hasKid === "no") {
    return;
  }

  const childrenOfRenunciantPersonSection = doc.struct("Sect");

  childrenOfRenunciantPersonSection.add(
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

  documentStruct.add(childrenOfRenunciantPersonSection);
};
