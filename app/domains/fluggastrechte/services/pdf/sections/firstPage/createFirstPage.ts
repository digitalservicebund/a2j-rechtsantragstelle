import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { createFlightCompensationClaim } from "./createFlightCompensationClaim";
import { createStatementClaim } from "./createStatementClaim";
import { getCourtByStartAndEndAirport } from "../../../getCourtByStartAndEndAirport";
import { createLocalCourtAndDate } from "~/domains/shared/services/pdf/createLocalCourtAndDate";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const amtsgericht = getCourtByStartAndEndAirport(
    userData.startAirport,
    userData.endAirport,
  );
  createLocalCourtAndDate(doc, documentStruct, amtsgericht);
  doc.moveDown(2);
  createFlightCompensationClaim(doc, documentStruct, userData);
  doc.moveDown(2);
  createStatementClaim(doc, documentStruct, userData);
};
