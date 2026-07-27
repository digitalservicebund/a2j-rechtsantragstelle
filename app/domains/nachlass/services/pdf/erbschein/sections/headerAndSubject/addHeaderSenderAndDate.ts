import type PDFDocument from "pdfkit";
import { today, toGermanDateString } from "~/util/date";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const CREATION_PDF_TEXT = "Erstellt am:";
const SENDER_TEXT = "Absender";

export const addHeaderSenderAndDate = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
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
          `${userData.antragstellendePersonVorname ?? ""} ${userData.antragstellendePersonNachname ?? ""}`,
          { continued: true },
        );
      doc.fillOpacity(0).text(",", { continued: false }).fillOpacity(1);
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${userData.antragstellendePersonStrasse ?? ""} ${userData.antragstellendePersonHausnummer ?? ""}`,
          { continued: true },
        );
      doc.fillOpacity(0).text(",", { continued: false }).fillOpacity(1);
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${userData.antragstellendePersonPlz ?? ""} ${userData.antragstellendePersonOrt ?? ""}`,
        )
        .moveDown(3);
    }),
  );

  documentStruct.add(senderAndDateSect);
};
