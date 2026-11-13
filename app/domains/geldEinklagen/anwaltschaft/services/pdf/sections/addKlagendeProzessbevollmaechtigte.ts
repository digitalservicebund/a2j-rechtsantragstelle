import type PDFDocument from "pdfkit";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { addProzessbevollmaechtigte } from "./addProzessbevollmaechtigte";

export const addKlagendeProzessbevollmaechtigte = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => addProzessbevollmaechtigte(doc, documentStruct, userData, "klagende");
