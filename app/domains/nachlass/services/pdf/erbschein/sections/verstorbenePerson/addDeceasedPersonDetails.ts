import type PDFDocument from "pdfkit";
import { toDateString } from "~/services/validation/dateObject";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const getStaatsangehoerigkeiten = (
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const secondNationality =
    userData.verstorbeneHadSecondNationality === "yes"
      ? `, ${userData.verstorbeneZweiteStaatsangehoerigkeit}`
      : undefined;
  const thirdNationality =
    userData.verstorbeneHadThirdNationality === "yes"
      ? `, ${userData.verstorbeneDritteStaatsangehoerigkeit}`
      : undefined;
  return `${userData.verstorbeneStaatsangehoerigkeit ?? ""}${secondNationality ?? ""}${thirdNationality ?? ""}`;
};

export const addDeceasedPersonDetails = (
  doc: typeof PDFDocument,
  deceasedPersonParagraph: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
) => {
  deceasedPersonParagraph.add(
    doc.struct("Span", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Vornamen: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.verstorbeneVorname ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Nachname: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.verstorbeneNachname ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsname: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          (userData.verstorbeneGeburtsname || userData.verstorbeneNachname) ??
            "",
        )
        .moveDown();

      doc
        .moveDown()
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Sterbedatum: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.sterbedatum ? toDateString(userData.sterbedatum) : "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Sterbeort: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.sterbeort ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsdatum: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          userData.verstorbeneGeburtsdatum
            ? toDateString(userData.verstorbeneGeburtsdatum)
            : "",
        )
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsort: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.verstorbeneGeburtsort ?? "")
        .moveDown(1);

      doc
        .moveDown()
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Familienstand: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          userData.verstorbeneFamilienstand
            ? {
                ledig: "Ledig",
                verheiratet: "Verheiratet",
                verwitwet: "Verwitwet",
                geschieden: "Geschieden",
              }[userData.verstorbeneFamilienstand]
            : "",
        )
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Staatsangehörigkeit(en): ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(getStaatsangehoerigkeiten(userData))
        .moveDown(1);
    }),
  );
};
