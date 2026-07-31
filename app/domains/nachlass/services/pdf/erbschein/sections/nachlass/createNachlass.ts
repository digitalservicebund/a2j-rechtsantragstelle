import type PDFDocument from "pdfkit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { addGrundbesitz } from "~/domains/nachlass/services/pdf/erbschein/sections/nachlass/addGrundbesitz";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const TITLE = "Nachlass";

const yesNoUnknownMap = {
  yes: "Ja",
  no: "Nein",
  unknown: "Ich weiß es nicht",
};

export const createNachlass = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const nachlassSection = doc.struct("Sect");

  nachlassSection.add(
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

  nachlassSection.add(
    doc.struct("P").add(
      doc.struct("Span", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Unternehmen im Nachlass: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            userData.hasUnternehmen
              ? yesNoUnknownMap[userData.hasUnternehmen]
              : "Nein",
          );
        if (userData.hasUnternehmen === "yes") {
          doc
            .font(FONTS_BUNDESSANS_REGULAR)
            .text("Unternehmensname(n): ", { continued: true })
            .font(FONTS_BUNDESSANS_BOLD)
            .text(
              userData.unternehmen
                ? userData.unternehmen
                    .map((unternehmen) => unternehmen.firmenname)
                    .join(", ")
                : "Nein",
            );
        }
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Auslandsvermögen im Nachlass: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            userData.hasVermoegen
              ? yesNoUnknownMap[userData.hasVermoegen]
              : "Nein",
          );

        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Grundbesitz im Nachlass: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            userData.hasGrundbesitz
              ? yesNoUnknownMap[userData.hasGrundbesitz]
              : "Nein",
          )
          .moveDown(1);
      }),
    ),
  );

  if (userData.hasGrundbesitz === "yes" && userData.grundbesitz?.length) {
    userData.grundbesitz.forEach((_, index) => {
      const grundbesitzSubsection = doc.struct("Sect");
      addGrundbesitz(doc, grundbesitzSubsection, userData, index);
      nachlassSection.add(grundbesitzSubsection);
    });
  }

  documentStruct.add(nachlassSection);
};
