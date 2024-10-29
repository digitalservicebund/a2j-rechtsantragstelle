import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechte/fluggastrechteFormular/context";
import { today, toGermanDateFormat } from "~/util/date";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";

export const CREATION_PDF_TEXT = "Erstellt am:";
export const TO_THE_COURT_TEXT = "An das";

export const createLocalCourtAndDate = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const { zustaendigesAmtsgericht: amtsgericht } = userData;
  const creationDate = `${CREATION_PDF_TEXT} ${toGermanDateFormat(today())}`;

  const localCourtHeaderSect = doc.struct("Sect");
  localCourtHeaderSect.add(
    doc.struct("P", {}, () => {
      doc.fontSize(10).font(FONTS_BUNDESSANS_REGULAR).text(creationDate, {
        align: "right",
      });
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(TO_THE_COURT_TEXT, { align: "left" });

      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(amtsgericht?.bezeichnung ?? "", { align: "left" });
      doc.text(amtsgericht?.strasseMitHausnummer ?? "", { align: "left" });
      doc.text(amtsgericht?.plzUndStadt ?? "", { align: "left" });
    }),
  );
  documentStruct.add(localCourtHeaderSect);
};
