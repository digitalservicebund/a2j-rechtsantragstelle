import type PDFDocument from "pdfkit";
import { getFullPlaintiffName } from "~/domains/fluggastrechte/services/pdf/sections/getFullPlaintiffName";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_BOLD,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

export const addSignature = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  const plaintiffName = getFullPlaintiffName(
    userData.klagendePersonAnrede,
    userData.klagendePersonTitle === "none" ? "" : userData.klagendePersonTitle,
    userData.klagendePersonVorname,
    userData.klagendePersonNachname,
  );

  const textHeight = getHeightOfString(plaintiffName, doc, PDF_WIDTH_SEIZE);

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: textHeight,
  });

  const plaintiffNameSect = doc.struct("Sect");

  plaintiffNameSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD).text(plaintiffName);
    }),
  );

  reasonSect.add(plaintiffNameSect);
};
