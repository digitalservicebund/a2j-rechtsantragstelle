import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addHeaderSenderAndDate } from "./addHeaderSenderAndDate";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const MAIN_TITLE = "Datenblatt zur Vorbereitung eines Erbscheinsantrags";

export const createHeaderAndSubject = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
) => {
  addHeaderSenderAndDate(doc, documentStruct, userData);

  const titleSubjectSection = doc.struct("Sect");

  titleSubjectSection.add(
    doc.struct("H1", {}, () => {
      doc
        .fontSize(31)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(MAIN_TITLE, { align: "left" })
        .fontSize(10);
      doc.moveDown(3);
    }),
  );

  documentStruct.add(titleSubjectSection);
};
