import type PDFDocument from "pdfkit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { printRelationshipToDeceased } from "~/domains/nachlass/services/pdf/shared/printRelationshipToDeceased";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { toDateString } from "~/services/validation/dateObject";

const TITLE = "Antragstellende Person";

export const createAntragstellendePerson = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const antragstellendePersonSection = doc.struct("Sect");

  antragstellendePersonSection.add(
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

  const antragstellendePersonParagraph = doc.struct("P").add(
    doc.struct("Span", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Vornamen: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.antragstellendePersonVorname ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Nachname: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.antragstellendePersonNachname ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsname: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          (userData.antragstellendePersonGeburtsname ||
            userData.antragstellendePersonNachname) ??
            "",
        )
        .moveDown();

      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsdatum: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          userData.antragstellendePersonGeburtsdatum
            ? toDateString(userData.antragstellendePersonGeburtsdatum)
            : "",
        )
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Familienverhältnis zum Erblasser: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          printRelationshipToDeceased(
            userData.antragstellendePersonRelationshipToErblasser,
          ),
        )
        .moveDown();

      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Anschrift: ")
        .font(FONTS_BUNDESSANS_BOLD);
      if (userData.antragstellendePersonAdresszusatz) {
        doc.text(userData.antragstellendePersonAdresszusatz);
      }
      doc.text(
        `${userData.antragstellendePersonStrasse} ${userData.antragstellendePersonHausnummer}`,
      );
      doc.text(
        `${userData.antragstellendePersonPlz} ${userData.antragstellendePersonOrt}`,
      );
      if (userData.antragstellendePersonLand) {
        doc.text(userData.antragstellendePersonLand);
      }

      doc.moveDown(2);
    }),
  );
  antragstellendePersonSection.add(antragstellendePersonParagraph);

  documentStruct.add(antragstellendePersonSection);
};
