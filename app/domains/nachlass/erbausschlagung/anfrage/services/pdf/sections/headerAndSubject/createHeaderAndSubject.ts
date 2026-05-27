import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { createHeaderSenderAndDate } from "./createHeaderSenderAndDate";

const MAIN_TITLE = "Datenblatt zur Vorbereitung einer Erbausschlagung";
const SUBJECT_TEXT =
  "Sehr geehrte Damen und Herren, \nmit diesem Dokument übermittle ich Ihnen meine Daten zur Vorbereitung der Erbausschlagung.\nMir ist bewusst:";

const TEXT_BULLETS = [
  "• Dieses Dokument ist keine rechtswirksame Erbausschlagung.",
  "• Die Frist (normalerweise 6 Wochen) wird hierdurch nicht unterbrochen.",
  "• Ich muss für die Ausschlagung persönlich beim Gericht erscheinen.",
];

const APPOINTMENT_TEXT =
  "Ich mich zur Terminabsprache mit Ihnen in Verbindung setzen, falls noch nicht geschehen.";
const BEST_REGARDS_TEXT = "Mit freundlichen Grüßen";

export const createHeaderAndSubject = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  createHeaderSenderAndDate(doc, documentStruct, userData);

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

  titleSubjectSection.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).text(SUBJECT_TEXT, { align: "left" });
    }),
  );

  const subjectList = doc.struct("L");

  for (const [index, textBullet] of TEXT_BULLETS.entries()) {
    const subjectListItem = doc.struct("LI");
    subjectListItem.add(
      doc.struct("LBody", {}, () => {
        doc
          .font(index === 0 ? FONTS_BUNDESSANS_BOLD : FONTS_BUNDESSANS_REGULAR)
          .text(textBullet, PDF_MARGIN_HORIZONTAL + 10);
      }),
    );
    subjectList.add(subjectListItem);
  }

  titleSubjectSection.add(subjectList);

  titleSubjectSection.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(APPOINTMENT_TEXT, PDF_MARGIN_HORIZONTAL)
        .text(BEST_REGARDS_TEXT)
        .text(
          `${userData.ausschlagendePersonVorname ?? ""} ${userData.ausschlagendePersonNachname}`,
        )
        .moveDown(2);
    }),
  );

  documentStruct.add(titleSubjectSection);
};
