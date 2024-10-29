import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechte/formular/context";
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
