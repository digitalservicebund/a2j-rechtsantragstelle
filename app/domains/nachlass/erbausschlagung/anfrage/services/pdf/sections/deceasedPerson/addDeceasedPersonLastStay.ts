import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "../../../../userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const LAST_RESIDENCE_TITLE = "Letzter gewöhnlicher Aufenthalt";

const getAddress = (userData: NachlassErbausschlagungAnfrageUserData) => {
  if (userData.verstorbeneLebensmittelpunkt === "ausland") {
    return {
      streetAndNumber: `${userData.verstorbeneAdresseStrasse ?? ""} ${userData.verstorbeneAdresseHausnummer ?? ""}`,
      postalCodeAndCity: `${userData.verstorbeneAuslaendischeAdressePLZ ?? ""} ${userData.verstorbeneAdresseOrt ?? ""}`,
      additionalAddress: userData.verstorbeneAdresseZusatz ?? "",
      country: userData.verstorbeneAuslaendischeAdresseLand ?? "",
    };
  }

  return {
    streetAndNumber: `${userData.verstorbeneAdresseStrasse ?? ""} ${userData.verstorbeneAdresseHausnummer ?? ""}`,
    postalCodeAndCity: `${userData.plzBeforeHospiz ?? userData.plzPflegeheim ?? userData.plzVerstorbene ?? ""} ${userData.verstorbeneAdresseOrt ?? ""}`,
    additionalAddress: userData.verstorbeneAdresseZusatz ?? "",
    country: "Deutschland",
  };
};

export const addDeceasedPersonLastStay = (
  doc: typeof PDFDocument,
  deceasedPersonSection: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  deceasedPersonSection.add(
    doc.struct("H3", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(14)
        .text(LAST_RESIDENCE_TITLE)
        .fontSize(10)
        .moveDown(1);
    }),
  );

  if (userData.livedInNursingHome === "yes") {
    deceasedPersonSection.add(
      doc.struct("P", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Aufenthaltsort: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text("Pflegeheim")
          .moveDown(0.5);
      }),
    );
  }

  deceasedPersonSection.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Anschrift:")
        .font(FONTS_BUNDESSANS_BOLD);

      const address = getAddress(userData);

      if (address.additionalAddress) {
        doc.text(address.additionalAddress);
      }

      doc.text(`${address.streetAndNumber}`);
      doc.text(`${address.postalCodeAndCity}`);
      doc.text(`${address.country}`);
    }),
  );
};
