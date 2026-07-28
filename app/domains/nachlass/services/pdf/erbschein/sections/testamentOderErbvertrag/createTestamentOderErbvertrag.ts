import type PDFDocument from "pdfkit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const TITLE = "Testament oder Erbvertrag";

export const createTestamentOderErbvertrag = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const testamentOderErbvertragSection = doc.struct("Sect");

  testamentOderErbvertragSection.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(16)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(TITLE, {
          align: "left",
        })
        .fontSize(10)
        .moveDown(1);
    }),
  );

  testamentOderErbvertragSection.add(
    doc.struct("P").add(
      doc.struct("Span", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Verfügung von Todes wegen: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            userData.testamentArt
              ? {
                  none: "Keine",
                  handwritten: "Handschriftliches Testament",
                  notarized: "Notarielles Testament",
                  erbvertrag: "Erbvertrag",
                }[userData.testamentArt]
              : "",
          )
          .moveDown(2);
      }),
    ),
  );

  documentStruct.add(testamentOderErbvertragSection);
};
