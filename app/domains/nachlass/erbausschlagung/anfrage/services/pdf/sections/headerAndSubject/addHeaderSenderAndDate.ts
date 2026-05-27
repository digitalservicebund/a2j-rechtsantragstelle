import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { today, toGermanDateString } from "~/util/date";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const CREATION_PDF_TEXT = "Erstellt am:";
export const SENDER_TEXT = "Absender";

export const addHeaderSenderAndDate = (
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
