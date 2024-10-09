import type PDFDocument from "pdfkit";
import { addAirlineDetails } from "./addAirlineDetails";
import { addFlightDetails } from "./addFlightDetails";
import { addPlaintiffDetails } from "./addPlaintiffDetails";
import { FONTS_BUNDESSANS_BOLD } from "../../../createPdfKitDocument";

export const IN_THE_MATTER = "in der Sache";
export const AGAINST = "gegen";

export const createClaimData = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const matterSect = doc.struct("Sect");
  matterSect.add(
    doc.struct("P", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(IN_THE_MATTER);
    }),
  );
  documentStruct.add(matterSect);
  doc.moveDown();

  addPlaintiffDetails(doc, documentStruct);

  doc.moveDown();

  const gegenSect = doc.struct("Sect");
  gegenSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(AGAINST, { align: "left" });
    }),
  );
  documentStruct.add(gegenSect);

  doc.moveDown();

  addAirlineDetails(doc, documentStruct);

  doc.moveDown();

  addFlightDetails(doc, documentStruct);
};
