import { decode } from "html-entities";
import type PDFDocument from "pdfkit";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  getBezifferterAntragText,
  getNebenantragItemText,
  getUnbezifferterSchmerzensgeldantragText,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeContent";
import { getOrderedKlageParties } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyOrdering";
import { getAntragNumber } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/antragOrdering";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

const textContent = (node: ReactNode) =>
  decode(renderToStaticMarkup(node).replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();

export const addHauptantraege = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  documentStruct.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(18).font(FONTS_BUNDESSANS_BOLD).text("Klageantrag");
      doc.moveDown();
    }),
  );
  documentStruct.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Es werden folgende Anträge gestellt:");
      doc.moveDown(0.5);
    }),
  );

  const orderedUserData = {
    ...userData,
    klagenden: getOrderedKlageParties(userData, "klagende").map(
      ({ partei }) => partei,
    ),
    beklagten: getOrderedKlageParties(userData, "beklagte").map(
      ({ partei }) => partei,
    ),
  };
  const list = doc.struct("L");
  const addAntrag = (
    number: number,
    mainText: ReactNode,
    additionalTexts: ReactNode[],
  ) => {
    const item = doc.struct("LI");
    const body = doc.struct("LBody");
    body.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(`${number}. ${textContent(mainText)}`, PDF_MARGIN_HORIZONTAL);
        doc.moveDown(0.5);
      }),
    );
    for (const text of additionalTexts) {
      body.add(
        doc.struct("P", {}, () => {
          doc.text(textContent(text), PDF_MARGIN_HORIZONTAL, undefined, {
            indent: 12,
          });
          doc.moveDown(0.5);
        }),
      );
    }
    item.add(body);
    list.add(item);
  };

  for (const [index, antrag] of (userData.hauptantrag ?? []).entries()) {
    addAntrag(
      getAntragNumber(userData, "hauptantrag", index),
      getBezifferterAntragText({
        userData: orderedUserData,
        hauptantragIndex: index,
      }),
      (antrag.nebenantraege ?? []).map((item) =>
        getNebenantragItemText({
          item,
          userData: orderedUserData,
          hauptantragIndex: index,
        }),
      ),
    );
  }
  for (const [index, antrag] of (
    userData.schmerzengeldantrag ?? []
  ).entries()) {
    addAntrag(
      getAntragNumber(userData, "schmerzengeldantrag", index),
      getUnbezifferterSchmerzensgeldantragText({
        userData: orderedUserData,
        schmerzengeldantragIndex: index,
      }),
      (antrag.nebenantraege ?? []).map((item) =>
        getNebenantragItemText({
          item,
          userData: orderedUserData,
          schmerzengeldantragIndex: index,
        }),
      ),
    );
  }
  documentStruct.add(list);
};
