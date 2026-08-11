import type PDFDocument from "pdfkit";
import { type Angehoerige } from "~/domains/nachlass/erbschein/anfrage/angehoerige/pages";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { addAngehoerige } from "~/domains/nachlass/services/pdf/erbschein/sections/angehoerige/addAngehoerige";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";

const TITLE = "Angehörige";

export const createAngehoerigeSection = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const angehoerigeSection = doc.struct("Sect");

  angehoerigeSection.add(
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

  userData.angehoerige?.forEach((angehoerige: Angehoerige) => {
    const angehoerigeSubsection = doc.struct("Sect");
    addAngehoerige(doc, angehoerigeSubsection, angehoerige);
    angehoerigeSection.add(angehoerigeSubsection);
  });

  documentStruct.add(angehoerigeSection);
};
