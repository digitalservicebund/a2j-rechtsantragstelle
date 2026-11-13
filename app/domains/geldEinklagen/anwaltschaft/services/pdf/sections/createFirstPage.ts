import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import type PDFDocument from "pdfkit";
import { addKlagendeProzessbevollmaechtigte } from "./addKlagendeProzessbevollmaechtigte";
import { addKlagende } from "./addKlagende";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { createLocalCourtAndDate } from "~/domains/shared/services/pdf/createLocalCourtAndDate";
import { findCourtByName } from "~/services/gerichtsfinder/amtsgerichtData.server";

const pilotCourtNames = {
  bitburg: "Amtsgericht Bitburg",
  bonn: "Amtsgericht Bonn",
  bremen: "Amtsgericht Bremen",
  duesseldorf: "Amtsgericht Düsseldorf",
  eilenburg: "Amtsgericht Eilenburg",
  erding: "Amtsgericht Erding",
  essen: "Amtsgericht Essen",
  "frankfurt-am-main": "Amtsgericht Frankfurt am Main",
  "hamburg-mitte": "Amtsgericht Hamburg",
  "koenigs-wusterhausen": "Amtsgericht Königs Wusterhausen",
  leipzig: "Amtsgericht Leipzig",
  mannheim: "Amtsgericht Mannheim",
  nuernberg: "Amtsgericht Nürnberg",
  nuertingen: "Amtsgericht Nürtingen",
  schoeneberg: "Amtsgericht Schöneberg",
  sinzig: "Amtsgericht Sinzig",
  steinfurt: "Amtsgericht Steinfurt",
} satisfies Record<
  NonNullable<GeldEinklagenAnwaltschaftUserData["pilotgericht"]>,
  string
>;

const MAIN_TITLE = "Klage";
const MAIN_SUBTITLE =
  "im Online-Verfahren nach Buch 12 Abschnitt 2 der Zivilprozessordnung";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  const courtName = userData.pilotgericht
    ? pilotCourtNames[userData.pilotgericht]
    : "";

  const amtsgericht = findCourtByName(courtName);

  createLocalCourtAndDate(doc, documentStruct, amtsgericht);
  doc.moveDown(4);

  documentStruct.add(
    doc.struct("H1", {}, () => {
      doc
        .fontSize(28)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(MAIN_TITLE, { align: "left" });
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(MAIN_SUBTITLE);
      doc.moveDown(4);
    }),
  );

  addKlagende(doc, documentStruct, userData);
  doc.moveDown(2);
  addKlagendeProzessbevollmaechtigte(doc, documentStruct, userData);
  doc.moveDown(2);
};
