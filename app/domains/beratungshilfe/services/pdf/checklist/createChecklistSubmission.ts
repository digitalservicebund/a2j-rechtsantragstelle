import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { pdfStyles } from "~/domains/shared/pdf/pdfStyles";
import { findCourtIfUnique } from "~/services/gerichtsfinder/amtsgerichtData.server";
import {
  FONTS_BUNDESSANS_BOLD,
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
        .fontSize(pdfStyles.h3.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("4. Antrag abgeben");
    }),
  );

  checklistSubmissionSect.add(
    doc.struct("P", {}, () => {
      doc
        .moveDown(0.5)
        .fontSize(pdfStyles.page.fontSize)
        .font(pdfStyles.page.font)
        .text(
          `Sie können den Antrag direkt im Amtsgericht abgeben oder per Post schicken.`,
          { indent: pdfStyles.sectionIndented.paddingLeft },
        );
      if (court) {
        doc.text(
          "Die Adresse des zuständigen Amtsgericht finden Sie auf der ersten Seite des Antrags im Adressfeld.",
          { indent: pdfStyles.sectionIndented.paddingLeft },
        );
      } else {
        doc.text(
          "Ihr zuständiges Amtsgericht finden Sie über den Service 'Amtsgericht finden'",
          { indent: pdfStyles.sectionIndented.paddingLeft },
        );
        doc.text("auf https://service.justiz.de/beratungshilfe.", {
          indent: pdfStyles.sectionIndented.paddingLeft,
        });
      }
    }),
  );

  documentStruct.add(checklistSubmissionSect);
};
