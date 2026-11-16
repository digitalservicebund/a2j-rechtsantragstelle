import type PDFDocument from "pdfkit";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { addKlageParties } from "./addKlageParties";

export const addKlagende = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => addKlageParties(doc, documentStruct, userData, "klagende");
