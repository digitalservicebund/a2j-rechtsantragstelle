import type PDFDocument from "pdfkit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { toDateString } from "~/services/validation/dateObject";

const TITLE = "Letzter Ehepartner oder letzte Ehepartnerin";
const SAME_ADDRESS_TEXT = "Entspricht der Adresse des Erblassers";

const getSpouseStaatsangehoerigkeiten = (
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const secondNationality =
    userData.ehepartnerHadSecondNationality === "yes"
      ? `, ${userData.ehepartnerZweiteStaatsangehoerigkeit}`
      : undefined;
  return `${userData.ehepartnerStaatsangehoerigkeit ?? ""}${secondNationality ?? ""}`;
};

export const createEhepartner = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const ehepartnerSection = doc.struct("Sect");

  ehepartnerSection.add(
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

  ehepartnerSection.add(
    doc.struct("P").add(
      doc.struct("Span", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Vornamen: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(userData.ehepartnerVorname ?? "")
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Nachname: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(userData.ehepartnerNachname ?? "")
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Geburtsname: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            (userData.ehepartnerGeburtsname || userData.ehepartnerNachname) ??
              "",
          )
          .moveDown();

        if (userData.verstorbeneFamilienstand === "verwitwet") {
          doc
            .font(FONTS_BUNDESSANS_REGULAR)
            .text("Sterbedatum: ", { continued: true })
            .font(FONTS_BUNDESSANS_BOLD)
            .text(
              userData.spouseSterbedatum
                ? toDateString(userData.spouseSterbedatum)
                : "",
            )
            .font(FONTS_BUNDESSANS_REGULAR)
            .text("Sterbeort: ", { continued: true })
            .font(FONTS_BUNDESSANS_BOLD)
            .text(userData.spouseSterbeort ?? "");
        }

        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Anschrift: ")
          .font(FONTS_BUNDESSANS_BOLD);
        if (userData.spouseHasSameAddress === "no") {
          if (userData.ehepartnerAdresszusatz) {
            doc.text(userData.ehepartnerAdresszusatz);
          }
          doc.text(
            `${userData.ehepartnerStrasse} ${userData.ehepartnerHausnummer}`,
          );
          doc.text(`${userData.ehepartnerPlz} ${userData.ehepartnerOrt}`);
        } else {
          doc.text(SAME_ADDRESS_TEXT);
        }
        doc.moveDown(1);

        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Staatsangehörigkeit(en): ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(getSpouseStaatsangehoerigkeiten(userData))
          .moveDown(1);

        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Ehevertrag: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            userData.hasEhevertrag === "yes"
              ? "Wurde geschlossen"
              : "Wurde nicht geschlossen",
          )
          .moveDown(1);
      }),
    ),
  );

  documentStruct.add(ehepartnerSection);
};
