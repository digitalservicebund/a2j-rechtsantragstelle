import type PDFDocument from "pdfkit";
import { pdfStyles } from "~/domains/shared/pdf/pdfStyles";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";

export const createChecklistSteps = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const checklistStepsSect = doc.struct("Sect");

  checklistStepsSect.add(
    doc.struct("H1", {}, () => {
      doc
        .fontSize(pdfStyles.h1.fontSize)
        .font(pdfStyles.h1.font)
        .text("Ihre nächsten Schritte");
    }),
  );

  checklistStepsSect.add(
    doc.struct("H2", {}, () => {
      doc
        .moveDown(1)
        .fontSize(pdfStyles.h2.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("So schicken Sie den Antrag ins Amtsgericht");
    }),
  );

  checklistStepsSect.add(
    doc.struct("H3", {}, () => {
      doc
        .moveDown(1)
        .fontSize(pdfStyles.h3.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("1. Antrag ausdrucken");
    }),
  );

  checklistStepsSect.add(
    doc.struct("H3", {}, () => {
      doc
        .moveDown(1)
        .fontSize(pdfStyles.h3.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("2. Antrag unterschreiben");
    }),
  );

  checklistStepsSect.add(
    doc.struct("P", {}, () => {
      doc
        .moveDown(0.5)
        .fontSize(pdfStyles.page.fontSize)
        .font(pdfStyles.page.font)
        .text(
          "Unterschreiben Sie den fertigen Antrag auf der letzten Seite im Feld",
          { indent: pdfStyles.sectionIndented.paddingLeft },
        )
        .text("“Unterschrift des Antragstellers/der Antragstellerin”", {
          indent: pdfStyles.sectionIndented.paddingLeft,
        });
    }),
  );

  checklistStepsSect.add(
    doc.struct("H3", {}, () => {
      doc
        .moveDown(1)
        .fontSize(pdfStyles.h3.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("3. Benötigte Dokumente kopieren");
    }),
  );

  checklistStepsSect.add(
    doc.struct("P", {}, () => {
      doc
        .moveDown(0.5)
        .fontSize(pdfStyles.page.fontSize)
        .font(pdfStyles.page.font)
        .text("Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:", {
          indent: pdfStyles.sectionIndented.paddingLeft,
        });
    }),
  );

  documentStruct.add(checklistStepsSect);
};
