import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import { FONTS_BUNDESSANS_REGULAR } from "~/services/pdf/createPdfKitDocument";
import { addDistanceInfo } from "./addDistanceInfo";
import { addMultiplePersonsInfo } from "./addMultiplePersonsInfo";
import { addOtherDetailsItinerary } from "./addOtherDetailsItinerary";
import { addWitnessesInfo } from "./addWitnessesInfo";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

const COMPENSATION_PAYMENT_TEXT =
  "gemäß Art. 7 der Fluggastrechteverordnung (EG) 261/2004 von der beklagten Partei mit einer Frist zum Datum der Frist ein. Die beklagte Partei hat jedoch bisher keine Zahlung geleistet.";
export const DEMANDED_COMPENSATION_PAYMENT_TEXT = `Die klagende Partei forderte außergerichtlich die Ausgleichszahlung ${COMPENSATION_PAYMENT_TEXT}`;
export const OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT = `Die klagende Partei sowie die weiteren betroffenen Fluggäste, forderten außergerichtlich die Ausgleichszahlungen ${COMPENSATION_PAYMENT_TEXT}`;

export const addCompensationAmount = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
  compensationStartYPosition: number,
) => {
  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10);

      addOtherDetailsItinerary(
        doc,
        compensationStartYPosition,
        userData.zusaetzlicheAngaben,
      );

      addDistanceInfo(doc, userData, compensationStartYPosition);

      addNewPageInCaseMissingVerticalSpace(doc);

      doc
        .text(
          `${userData.isWeiterePersonen === "no" ? DEMANDED_COMPENSATION_PAYMENT_TEXT : OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT}`,
        )
        .moveDown(MARGIN_BETWEEN_SECTIONS);

      addMultiplePersonsInfo(doc, userData);

      addWitnessesInfo(doc, userData);

      doc.moveDown(2);
    }),
  );
  documentStruct.add(compensationSect);
};
