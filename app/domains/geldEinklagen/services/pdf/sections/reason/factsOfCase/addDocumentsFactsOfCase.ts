import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";
import { MARGIN_RIGHT_SPACE } from "./addWitnessOfCase";

export const addDocumentsFactsOfCase = (
  doc: PDFKit.PDFDocument,
  factsOfCasesSect: PDFKit.PDFStructureElement,
  dokumenten: Exclude<
    GeldEinklagenFormularUserData["abschnitte"],
    undefined
  >[number]["dokumenten"],
  documentIds: string[],
  abschnittIndex: number,
) => {
  if (!arrayIsNonEmpty(dokumenten)) {
    return;
  }

  const documents: Array<{ id: number; text: string }> = [];

  for (const [index, dokument] of dokumenten.entries()) {
    const documentId =
      documentIds.findIndex(
        (value) =>
          value === dokument.dokumentReference ||
          (value === `${abschnittIndex}-${index}` &&
            dokument.dokumentReference === undefined),
      ) + 1;

    documents.push({
      id: documentId,
      text: dokument.beschreibung,
    });
  }

  documents
    .toSorted((a, b) => a.id - b.id)
    .forEach((document) => {
      factsOfCasesSect.add(
        doc.struct("P", {}, () => {
          doc
            .font(FONTS_BUNDESSANS_BOLD)
            .text(`Beweis K${document.id}: `, MARGIN_RIGHT_SPACE, undefined, {
              continued: true,
            })
            .font(FONTS_BUNDESSANS_REGULAR)
            .text(document.text ?? "")
            .moveDown(1);
        }),
      );
    });
};
