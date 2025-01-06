import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const PLAINTIFF_BOOKED_TEXT =
  "Die klagende Partei buchte den folgenden Flug, ";
export const PLAINTIFF_BOOKED_MULTIPLE_PERSONS_TEXT =
  "Die klagende Partei buchte gemeinsam mit weiteren Fluggästen den folgenden Flug, ";
export const ARTICLE_DELAY_CANCEL_TEXT = "der ";
export const ARTICLE_NOT_MOVE_TEXT = "und wurde ";
export const DELAY_TEXT = "nicht pünktlich ausgeführt ";
export const CANCEL_TEXT = "annulliert ";
export const NOT_MOVE_TEXT = "nicht befördert";
export const PASSIVE_VERB_TEXT = "wurde";
export const FINAL_COLON_SENTENCE = ":";

const getPlaintiffBookedText = ({
  isWeiterePersonen,
}: FluggastrechtContext) => {
  if (isWeiterePersonen === "yes") {
    return PLAINTIFF_BOOKED_MULTIPLE_PERSONS_TEXT;
  }

  return PLAINTIFF_BOOKED_TEXT;
};

const getBereichArticleText = ({ bereich }: FluggastrechtContext) => {
  if (bereich === "nichtbefoerderung") {
    return ARTICLE_NOT_MOVE_TEXT;
  }

  return ARTICLE_DELAY_CANCEL_TEXT;
};

const getBereichText = ({ bereich }: FluggastrechtContext) => {
  if (bereich === "verspaetet") {
    return DELAY_TEXT;
  }

  if (bereich === "annullierung") {
    return CANCEL_TEXT;
  }

  if (bereich === "nichtbefoerderung") {
    return NOT_MOVE_TEXT;
  }

  return "";
};

export const addReason = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(getPlaintiffBookedText(userData), {
          continued: true,
        })
        .text(getBereichArticleText(userData), {
          continued: true,
        })
        .text("von der beklagten Partei ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(getBereichText(userData), {
          continued: true,
        })
        .font(FONTS_BUNDESSANS_REGULAR);

      if (userData.bereich !== "nichtbefoerderung") {
        doc.text(PASSIVE_VERB_TEXT, { continued: true });
      }

      doc.text(FINAL_COLON_SENTENCE);
    }),
  );
  documentStruct.add(reasonSect);
};
