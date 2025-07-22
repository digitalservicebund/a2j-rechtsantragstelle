import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { addDistanceInfo } from "./addDistanceInfo";
import { addMultiplePersonsInfo } from "./addMultiplePersonsInfo";
import { addOtherDetailsItinerary } from "./addOtherDetailsItinerary";
import { addWitnessesInfo } from "./addWitnessesInfo";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

const COMPENSATION_PAYMENT_TEXT =
  "gemäß Art. 7 der Fluggastrechteverordnung (EG) 261/2004 von der beklagten Partei mit einer hinreichenden Frist von mindestens 2 Wochen ein. Die beklagte Partei hat jedoch trotz Fristablauf bisher keine Zahlung geleistet.";
export const DEMANDED_COMPENSATION_PAYMENT_TEXT = `Die klagende Partei forderte außergerichtlich die Ausgleichszahlung ${COMPENSATION_PAYMENT_TEXT}`;
export const OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT = `Die klagende Partei, sowie die weiteren betroffenen Fluggäste, forderten außergerichtlich die Ausgleichszahlungen ${COMPENSATION_PAYMENT_TEXT}`;

export const addCompensationAmount = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10);
      addOtherDetailsItinerary(doc, userData.zusaetzlicheAngaben);
    }),
  );
  reasonSect.add(
    doc.struct("P", {}, () => {
      addDistanceInfo(doc, userData);
    }),
  );

  const demandedCompensationPaymentText =
    userData.isWeiterePersonen === "no"
      ? DEMANDED_COMPENSATION_PAYMENT_TEXT
      : OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT;

  const demandedCompensationPaymentTextHeight = doc.heightOfString(
    demandedCompensationPaymentText,
    {
      width: PDF_WIDTH_SEIZE,
    },
  );

  addNewPageInCaseMissingVerticalSpace(
    doc,
    demandedCompensationPaymentTextHeight,
  );

  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .text(demandedCompensationPaymentText)
        .moveDown(MARGIN_BETWEEN_SECTIONS);
    }),
  );

  reasonSect.add(
    doc.struct("P", {}, () => {
      addMultiplePersonsInfo(doc, userData);
    }),
  );

  reasonSect.add(
    doc.struct("P", {}, () => {
      addWitnessesInfo(doc, userData);
    }),
  );
  doc.moveDown(2);
};
