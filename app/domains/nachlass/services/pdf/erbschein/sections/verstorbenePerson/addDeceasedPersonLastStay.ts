import type PDFDocument from "pdfkit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const LAST_RESIDENCE_TITLE = "Letzter gewöhnlicher Aufenthalt";

const getPlz = (userData: NachlassErbscheinAnfrageUserData) => {
  if (userData.verstorbeneLivedInPflegeheim === "yes") {
    return userData.verstorbenePflegeheimPlz;
  }
  if (userData.verstorbeneLivedInHospiz === "yes") {
    return userData.verstorbeneHospizPlz;
  }
  return userData.verstorbenePlz;
};

const getAddress = (userData: NachlassErbscheinAnfrageUserData) => {
  if (userData.verstorbeneLebensmittelpunkt === "ausland") {
    return {
      additionalAddress:
        userData.verstorbenePersonAuslaendischerAdresszusatz ?? "",
      streetAndNumber: `${userData.verstorbenePersonAuslaendischeStrasse ?? ""} ${userData.verstorbenePersonAuslaendischeHausnummer ?? ""}`,
      postalCodeAndCity: userData.verstorbenePersonAuslaendischerOrt ?? "",
      country: userData.verstorbenePersonLand ?? "",
    };
  }

  return {
    additionalAddress: userData.verstorbenePersonAdresszusatz ?? "",
    streetAndNumber: `${userData.verstorbenePersonStrasse ?? ""} ${userData.verstorbenePersonHausnummer ?? ""}`,
    postalCodeAndCity: `${getPlz(userData) ?? ""} ${userData.verstorbenePersonOrt ?? ""}`,
    country: "Deutschland",
  };
};

export const addDeceasedPersonLastStay = (
  doc: typeof PDFDocument,
  deceasedPersonSection: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
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

  if (userData.verstorbeneLivedInPflegeheim === "yes") {
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
      doc.moveDown(2);
    }),
  );
};
