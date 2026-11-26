import type PDFDocument from "pdfkit";
import type { ReactNode } from "react";
import { decode } from "html-entities";
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
import { addMissingData } from "./addMissingData";

const getPdfText = (node: ReactNode) =>
  decode(
    renderToStaticMarkup(node)
      .replace(/<\/div>|<br\s*\/?>/g, " ")
      .replace(/<[^>]*>/g, ""),
  )
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
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Es werden folgende Anträge gestellt:");
      doc.moveDown(0.5);
    }),
  );

  if (
    !userData.hauptantrag?.length &&
    !userData.schmerzengeldantrag?.length &&
    !userData.sonstigeAntraege?.length
  ) {
    addMissingData(doc, documentStruct, "Bezifferter Zahlungsantrag");
    addMissingData(doc, documentStruct, "Unbezifferter Schmerzensgeldantrag");
    return;
  }

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
          .text(`${number}. ${getPdfText(mainText)}`, PDF_MARGIN_HORIZONTAL);
      }),
    );
    if (additionalTexts.length > 0) {
      body.add(
        doc.struct("P", {}, () => {
          doc
            .fontSize(10)
            .font(FONTS_BUNDESSANS_REGULAR)
            .text("Daneben:", PDF_MARGIN_HORIZONTAL);
        }),
      );
    }
    for (const text of additionalTexts) {
      body.add(
        doc.struct("P", {}, () => {
          const bullet = "\u2022 ";
          const bulletWidth = doc.widthOfString(bullet);
          doc.text(
            `${bullet}${getPdfText(text)}`,
            PDF_MARGIN_HORIZONTAL + 12 + bulletWidth,
            undefined,
            { indent: -bulletWidth },
          );
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
  doc.moveDown();
};
