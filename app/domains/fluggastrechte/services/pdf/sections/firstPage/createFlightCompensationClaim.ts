import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { createClaimData } from "./claimData/createClaimData";

export const createFlightCompensationClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const flightCompensationClaimSect = doc.struct("Sect");
  createClaimData(doc, flightCompensationClaimSect, userData);
  documentStruct.add(flightCompensationClaimSect);
};
