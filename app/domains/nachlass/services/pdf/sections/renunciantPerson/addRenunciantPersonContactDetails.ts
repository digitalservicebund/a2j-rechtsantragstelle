import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const addRenunciantPersonContactDetails = (
  doc: typeof PDFDocument,
  renunciantPersonSection: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  renunciantPersonSection.add(
    doc.struct("Link", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Telefonnummer: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.ausschlagendePersonTelefon ?? "", {
          link: `tel:${userData.ausschlagendePersonTelefon?.trim()}`,
        });
    }),
  );

  if (userData.ausschlagendePersonEmail) {
    renunciantPersonSection.add(
      doc.struct("Link", { alt: userData.ausschlagendePersonEmail }, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("E-Mail: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(userData.ausschlagendePersonEmail ?? "", {
            link: `mailto:${userData.ausschlagendePersonEmail}`,
          });
      }),
    );
  }
};
