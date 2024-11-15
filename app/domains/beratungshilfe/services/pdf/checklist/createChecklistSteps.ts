import type PDFDocument from "pdfkit";
import { styles } from "~/services/pdf/attachment/styles";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const createChecklistSteps = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const checklistStepsSect = doc.struct("Sect");

  checklistStepsSect.add(
    doc.struct("H1", {}, () => {
      doc
        .fontSize(styles.h1.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Ihre nächsten Schritte");
    }),
  );

  checklistStepsSect.add(
    doc.struct("H2", {}, () => {
      doc
        .moveDown(1)
        .fontSize(styles.h2.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("So schicken Sie den Antrag ins Amtsgericht");
    }),
  );

  checklistStepsSect.add(
    doc.struct("H3", {}, () => {
      doc
        .moveDown(1)
        .fontSize(styles.h3.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("1. Antrag ausdrucken");
    }),
  );

  checklistStepsSect.add(
    doc.struct("H3", {}, () => {
      doc
        .moveDown(1)
        .fontSize(styles.h3.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("2. Antrag unterschreiben");
    }),
  );

  checklistStepsSect.add(
    doc.struct("P", {}, () => {
      doc
        .moveDown(0.5)
        .fontSize(styles.page.fontSize)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          "Unterschreiben Sie den fertigen Antrag auf der letzten Seite im Feld",
          { indent: styles.sectionIndented.paddingLeft },
        )
        .text("“Unterschrift des Antragstellers/der Antragstellerin”", {
          indent: styles.sectionIndented.paddingLeft,
        });
    }),
  );

  checklistStepsSect.add(
    doc.struct("H3", {}, () => {
      doc
        .moveDown(1)
        .fontSize(styles.h3.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("3. Benötigte Dokumente kopieren");
    }),
  );

  checklistStepsSect.add(
    doc.struct("P", {}, () => {
      doc
        .moveDown(0.5)
        .fontSize(styles.page.fontSize)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:", {
          indent: styles.sectionIndented.paddingLeft,
        });
    }),
  );

  documentStruct.add(checklistStepsSect);
};
