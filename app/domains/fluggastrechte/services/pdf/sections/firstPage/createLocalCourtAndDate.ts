import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getCourtByStartAndEndAirport } from "~/domains/fluggastrechte/services/getCourtByStartAndEndAirport";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { today, toGermanDateFormat } from "~/util/date";

export const CREATION_PDF_TEXT = "Erstellt am:";
export const TO_THE_COURT_TEXT = "An das";

export const createLocalCourtAndDate = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  { startAirport, endAirport }: FluggastrechtContext,
) => {
  const amtsgericht = getCourtByStartAndEndAirport(startAirport, endAirport);
  const creationDate = `${CREATION_PDF_TEXT} ${toGermanDateFormat(today())}`;

  const localCourtHeaderSect = doc.struct("Sect");
  localCourtHeaderSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(TO_THE_COURT_TEXT, { align: "left", continued: true });

      doc.font(FONTS_BUNDESSANS_REGULAR).text(creationDate, {
        align: "right",
      });

      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(amtsgericht?.BEZEICHNUNG ?? "", { align: "left" });

      doc.text(amtsgericht?.STR_HNR ?? "", { align: "left" });
      doc.text(`${amtsgericht?.PLZ_ZUSTELLBEZIRK ?? ""} ${amtsgericht?.ORT}`, {
        align: "left",
      });
    }),
  );
  documentStruct.add(localCourtHeaderSect);
};
