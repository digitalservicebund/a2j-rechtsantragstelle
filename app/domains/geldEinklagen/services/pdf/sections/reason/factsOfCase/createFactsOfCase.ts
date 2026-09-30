import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";
import { addWitnessOfCase } from "./addWitnessOfCase";
import { addDocumentsFactsOfCase } from "./addDocumentsFactsOfCase";

const FACTS_OF_CASES_TEXT = "I. Sachverhalt";

const buildDocumentIds = (
  abschnitte: Exclude<GeldEinklagenFormularUserData["abschnitte"], undefined>,
) => {
  const documentIds: string[] = [];

  abschnitte.forEach((abschnitt, abschnittIndex) => {
    if (arrayIsNonEmpty(abschnitt.dokumenten)) {
      abschnitt.dokumenten.forEach((document, documentIndex) => {
        const reference =
          document.dokumentReference ?? `${abschnittIndex}-${documentIndex}`;
        if (!documentIds.includes(reference)) {
          documentIds.push(reference);
        }
      });
    }
  });

  return documentIds;
};

export const createFactsOfCase = (
  doc: PDFKit.PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  { abschnitte }: GeldEinklagenFormularUserData,
) => {
  if (!arrayIsNonEmpty(abschnitte)) {
    return;
  }

  const factsOfCasesSect = doc.struct("Sect");

  factsOfCasesSect.add(
    doc.struct("H3", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(FACTS_OF_CASES_TEXT)
        .moveDown(1);
    }),
  );

  reasonSect.add(factsOfCasesSect);

  const documentIds = buildDocumentIds(abschnitte);

  for (const [abschnittIndex, abschnitt] of abschnitte.entries()) {
    factsOfCasesSect.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(abschnitt.beschreibung, PDF_MARGIN_HORIZONTAL, undefined)
          .moveDown(1);
      }),
    );

    addDocumentsFactsOfCase(
      doc,
      factsOfCasesSect,
      abschnitt.dokumenten,
      documentIds,
      abschnittIndex,
    );
    addWitnessOfCase(doc, factsOfCasesSect, abschnitt.personen);
  }

  doc.moveDown(1.5);
};
