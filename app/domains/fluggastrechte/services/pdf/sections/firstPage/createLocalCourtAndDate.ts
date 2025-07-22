import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { getCourtByStartAndEndAirport } from "~/domains/fluggastrechte/services/getCourtByStartAndEndAirport";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { today, toGermanDateFormat } from "~/util/date";

export const CREATION_PDF_TEXT = "Erstellt am:";
export const TO_THE_COURT_TEXT = "An das";

export const createLocalCourtAndDate = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  { startAirport, endAirport }: FluggastrechteUserData,
) => {
  const amtsgericht = getCourtByStartAndEndAirport(startAirport, endAirport);
  const creationDate = `${CREATION_PDF_TEXT} ${toGermanDateFormat(today())}`;

  const courtAndDateSect = doc.struct("Sect");

  const startY = doc.y;

  courtAndDateSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(creationDate, PDF_MARGIN_HORIZONTAL, startY, { align: "right" });
    }),
  );

  courtAndDateSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(TO_THE_COURT_TEXT, PDF_MARGIN_HORIZONTAL, startY, {
          align: "left",
          continued: false,
        });
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(amtsgericht?.BEZEICHNUNG ?? "", { continued: true });
      doc.fillOpacity(0).text(",", { continued: false }).fillOpacity(1);
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(amtsgericht?.STR_HNR ?? "", { continued: true });
      doc.fillOpacity(0).text(",", { continued: false }).fillOpacity(1);
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${amtsgericht?.PLZ_ZUSTELLBEZIRK ?? ""} ${amtsgericht?.ORT ?? ""}`,
        );
    }),
  );

  documentStruct.add(courtAndDateSect);
};
