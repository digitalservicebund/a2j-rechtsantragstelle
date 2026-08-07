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
  currentDocumentIndex: number,
) => {
  if (!arrayIsNonEmpty(dokumenten)) {
    return;
  }

  for (const dokument of dokumenten) {
    factsOfCasesSect.add(
      doc.struct("P", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            `Beweis K${currentDocumentIndex + 1}: `,
            MARGIN_RIGHT_SPACE,
            undefined,
            {
              continued: true,
            },
          )
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(dokument.beschreibung ?? "")
          .moveDown(1);
      }),
    );
  }
};
