import { MARGIN_RIGHT } from "~/domains/fluggastrechte/services/pdf/configurations";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";

const bulletText = "•  ";
export const MARGIN_RIGHT_SPACE = PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT;

const WITNESS_TEXT =
  "Beweis angeboten durch Vernehmung der folgenden Personen als Zeugen oder Zeuginnen:";
const PARTY_WITNESS_TEXT =
  "Beweis angeboten durch Parteivernehmung der folgenden Personen:";

export const addWitnessOfCase = (
  doc: PDFKit.PDFDocument,
  factsOfCasesSect: PDFKit.PDFStructureElement,
  personen: Exclude<
    GeldEinklagenFormularUserData["abschnitte"],
    undefined
  >[number]["personen"],
) => {
  if (!arrayIsNonEmpty(personen)) {
    return;
  }

  const personenWithAnotherPerson = personen.filter(
    (person) => person.personAuswahl === "anotherPerson",
  );

  const personenWithParty = personen.filter(
    (person) => person.personAuswahl !== "anotherPerson",
  );

  if (personenWithAnotherPerson.length > 0) {
    const witnessList = doc.struct("L");
    witnessList.add(
      doc.struct("Caption", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_BOLD)
          .text(WITNESS_TEXT, MARGIN_RIGHT_SPACE, undefined);
      }),
    );

    factsOfCasesSect.add(witnessList);
    doc.moveDown(1);
  }

  if (personenWithParty.length > 0) {
    const witnessList = doc.struct("L");
    witnessList.add(
      doc.struct("Caption", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_BOLD)
          .text(PARTY_WITNESS_TEXT, MARGIN_RIGHT_SPACE, undefined);
      }),
    );

    for (const personWithParty of personenWithParty) {
      const witnessListListItem = doc.struct("LI");

      const itemText =
        personWithParty.personAuswahl === "beklagte"
          ? "Beklagte Person"
          : "Klagende Person";

      witnessListListItem.add(
        doc.struct("LBody", {}, () => {
          doc
            .moveDown(0.5)
            .font(FONTS_BUNDESSANS_BOLD)
            .text(bulletText, MARGIN_RIGHT_SPACE + 3, undefined, {
              continued: true,
            })
            .text(itemText)
            .font(FONTS_BUNDESSANS_REGULAR);
        }),
      );
      witnessList.add(witnessListListItem);
    }

    factsOfCasesSect.add(witnessList);
    doc.moveDown(1);
  }
};
