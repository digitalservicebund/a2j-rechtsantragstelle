import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { createClaimData } from "./claimData/createClaimData";

export const createFlightCompensationClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const flightCompensationClaimSect = doc.struct("Sect");
  createClaimData(doc, flightCompensationClaimSect, userData);
  documentStruct.add(flightCompensationClaimSect);
};
