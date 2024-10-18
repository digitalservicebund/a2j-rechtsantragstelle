import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";
import { createPageFooter } from "../createPageFooter";

export const createThirdPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text("II. Entschädigungshöhe");
  doc.moveDown(1);

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(
      "Die Distanz zwischen Berlin Brandenburg Flughafen (BER) und Athens International Airport (ATH) beträgt nach Großkreismethode ca. 600km. Damit ergibt sich nach Art. 7 der Fluggastrechteverordnung (EG) 261/2004 eine Entschädigung in Höhe von 100 €.",
    );

  doc.moveDown(2);

  doc.fontSize(10).font(FONTS_BUNDESSANS_BOLD).text("Włodzimierz Ciesiński");

  createPageFooter(doc, documentStruct, userData);
};
