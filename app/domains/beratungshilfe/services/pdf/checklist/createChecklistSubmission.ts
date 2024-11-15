import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { findCourtIfUnique } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { styles } from "~/services/pdf/attachment/styles";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const createChecklistSubmission = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: BeratungshilfeFormularContext,
) => {
  const court = findCourtIfUnique(userData.plz);
  const checklistSubmissionSect = doc.struct("Sect");

  checklistSubmissionSect.add(
    doc.struct("H3", {}, () => {
      doc
        .moveDown(0.5)
        .fontSize(styles.h3.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("4. Antrag abgeben");
    }),
  );

  checklistSubmissionSect.add(
    doc.struct("P", {}, () => {
      doc
        .moveDown(0.5)
        .fontSize(styles.page.fontSize)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `Sie können den Antrag direkt im Amtsgericht abgeben oder per Post schicken.`,
          { indent: styles.sectionIndented.paddingLeft },
        );
      if (court) {
        doc.text(
          "Die Adresse des zuständigen Amtsgericht finden Sie auf der ersten Seite des Antrags im Adressfeld.",
          { indent: styles.sectionIndented.paddingLeft },
        );
      } else {
        doc.text(
          "Ihr zuständiges Amtsgericht finden Sie über den Service 'Amtsgericht finden'",
          { indent: styles.sectionIndented.paddingLeft },
        );
        doc.text("auf https://service.justiz.de/beratungshilfe.", {
          indent: styles.sectionIndented.paddingLeft,
        });
      }
    }),
  );

  documentStruct.add(checklistSubmissionSect);
};
