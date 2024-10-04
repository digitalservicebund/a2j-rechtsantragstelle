import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";
import { createBankInformation } from "../createBankInformation";
import { createPageLine } from "../createPageLine";
import { createStamp } from "../createStamp";

export const createThirdPage = (doc: typeof PDFDocument) => {
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

  createStamp(doc);
  createPageLine(doc, 3);
  createBankInformation(doc);
};
