import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN,
} from "../../createPdfKitDocument";

export const createLastSentences = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10).text(
        "Die Fluggesellschaft hat keine außergewöhnlichen Umstände als Grund für die Verspätung mitgeteilt. Die klagende Partei geht davon aus, dass die genannten Umstände nicht korrekt ist.",
        PDF_MARGIN,
        480, // start to print this text from this line
      );

      doc.moveDown(1);

      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text(
          "Die klagende Partei forderte außergerichtlich die Ausgleichszahlungen gemäß Art. 7 der Fluggastrechteverordnung (EG) 261/2004 von der beklagten Partei mit einer Frist zum Datum der Frist ein. Die beklagte Partei hat jedoch bisher keine Zahlung geleistet.",
        );
    }),
  );
  documentStruct.add(compensationSect);
};
