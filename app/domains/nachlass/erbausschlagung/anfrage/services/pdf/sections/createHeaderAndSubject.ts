import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "../../../userData";
import { today, toGermanDateString } from "~/util/date";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const CREATION_PDF_TEXT = "Erstellt am:";
export const SENDER_TEXT = "Absender";

export const createHeaderSenderAndDate = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  const creationDate = `${CREATION_PDF_TEXT} ${toGermanDateString(today())}`;

  const senderAndDateSect = doc.struct("Sect");
  const startY = doc.y;

  senderAndDateSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(creationDate, PDF_MARGIN_HORIZONTAL, startY, { align: "right" });
    }),
  );

  senderAndDateSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(SENDER_TEXT, PDF_MARGIN_HORIZONTAL, startY, {
          align: "left",
          continued: false,
        });
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${userData.ausschlagendePersonVorname ?? ""} ${userData.ausschlagendePersonNachname}`,
          { continued: true },
        );
      doc.fillOpacity(0).text(",", { continued: false }).fillOpacity(1);
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${userData.ausschlagendePersonStrasse ?? ""} ${userData.ausschlagendePersonHausnummer ?? ""}`,
          { continued: true },
        );
      doc.fillOpacity(0).text(",", { continued: false }).fillOpacity(1);
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${userData.ausschlagendePersonPlz} ${userData.ausschlagendePersonOrt ?? ""}`,
        )
        .moveDown(3);
    }),
  );

  documentStruct.add(senderAndDateSect);
};

const MAIN_TITLE = "Datenblatt zur Vorbereitung einer Erbausschlagung";
const SUBJECT_TEXT =
  "Sehr geehrte Damen und Herren, \nmit diesem Dokument übermittle ich Ihnen meine Daten zur Vorbereitung der Erbausschlagung.\nMir ist bewusst:";

const TEXT_BULLETS = {
  "1. ": "Dieses Dokument ist keine rechtswirksame Erbausschlagung.",
  "2. ":
    "Die Frist (normalerweise 6 Wochen) wird hierdurch nicht unterbrochen.",
  "3. ": "Ich muss für die Ausschlagung persönlich beim Gericht erscheinen.",
};
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

  for (const [bullet, claim] of Object.entries(TEXT_BULLETS)) {
    const subjectListItem = doc.struct("LI");
    subjectListItem.add(
      doc.struct("LBody", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_BOLD)
          .text(bullet, PDF_MARGIN_HORIZONTAL + 10, undefined, {
            continued: true,
          })
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(claim);
        doc.moveDown(0.5);
      }),
    );
    titleSubjectSection.add(subjectListItem);
  }

  titleSubjectSection.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(APPOINTMENT_TEXT, PDF_MARGIN_HORIZONTAL)
        .text(BEST_REGARDS_TEXT)
        .text(
          `${userData.ausschlagendePersonVorname ?? ""} ${userData.ausschlagendePersonNachname}`,
        );
    }),
  );

  documentStruct.add(titleSubjectSection);
};
