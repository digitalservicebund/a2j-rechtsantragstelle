import capitalize from "lodash/capitalize";
import type PDFDocument from "pdfkit";
import { getFullPlaintiffName } from "~/domains/fluggastrechte/services/pdf/sections/getFullPlaintiffName";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

const getSignatureText = (
  userData: GeldEinklagenFormularUserData,
): { signatureText: string; signatureSubtitleText: string } => {
  if (userData.anwaltschaft === "no") {
    return {
      signatureText: getFullPlaintiffName(
        userData.klagendePersonAnrede,
        userData.klagendePersonTitle,
        userData.klagendePersonVorname,
        userData.klagendePersonNachname,
      ),
      signatureSubtitleText: "",
    };
  }

  const {
    klagendePersonAnwaltschaftAnrede,
    klagendePersonAnwaltschaftNachname,
    klagendePersonAnwaltschaftTitle,
    klagendePersonAnwaltschaftVorname,
    klagendePersonAnwaltschaftBerufsbezeichnung,
  } = userData;

  const salutation =
    klagendePersonAnwaltschaftAnrede === "none"
      ? ""
      : capitalize(klagendePersonAnwaltschaftAnrede);
  const capitalizedVorname = capitalize(klagendePersonAnwaltschaftVorname);

  return {
    signatureText: [
      salutation,
      klagendePersonAnwaltschaftTitle,
      capitalizedVorname,
      klagendePersonAnwaltschaftNachname,
    ]
      .filter(Boolean)
      .join(" "),
    signatureSubtitleText: klagendePersonAnwaltschaftBerufsbezeichnung
      ? `(${klagendePersonAnwaltschaftBerufsbezeichnung})`
      : "",
  };
};

export const addSignature = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  const { signatureSubtitleText, signatureText } = getSignatureText(userData);

  const textHeight = getHeightOfString(
    [signatureText, signatureSubtitleText],
    doc,
    PDF_WIDTH_SEIZE,
  );

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: textHeight,
    numberOfParagraphs: 2,
  });

  const plaintiffNameSect = doc.struct("Sect");

  plaintiffNameSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD).text(signatureText);
      doc.font(FONTS_BUNDESSANS_REGULAR).text(signatureSubtitleText);
    }),
  );

  reasonSect.add(plaintiffNameSect);
};
