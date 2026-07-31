import type PDFDocument from "pdfkit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const TITLE = "Weitere Angaben";

export const createWeitereAngaben = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const weitereAngabenSection = doc.struct("Sect");

  weitereAngabenSection.add(
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

  weitereAngabenSection.add(
    doc.struct("P").add(
      doc.struct("Span", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Weitere Angaben: ")
          .font(FONTS_BUNDESSANS_BOLD)
          .text(userData.weitereAngaben!);
      }),
    ),
  );

  documentStruct.add(weitereAngabenSection);
};
