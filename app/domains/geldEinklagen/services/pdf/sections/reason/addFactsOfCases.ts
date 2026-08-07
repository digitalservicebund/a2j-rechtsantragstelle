import { MARGIN_RIGHT } from "~/domains/fluggastrechte/services/pdf/configurations";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";

const FACTS_OF_CASES_TEXT = "I. Sachverhalt";
const bulletText = "•  ";
const MARGIN_RIGHT_SPACE = PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT;

const WITNESS_TEXT =
  "Beweis angeboten durch Vernehmung der folgenden Personen als Zeugen oder Zeuginnen:";
const PARTY_WITNESS_TEXT =
  "Beweis angeboten durch Parteivernehmung der folgenden Personen:";

const addDocumentsFactsOfCase = (
  doc: PDFKit.PDFDocument,
  factsOfCasesSect: PDFKit.PDFStructureElement,
  dokumenten: Exclude<
    GeldEinklagenFormularUserData["abschnitte"],
    undefined
  >[number]["dokumenten"],
  currentDocumentIndex: number,
) => {
  if (!arrayIsNonEmpty(dokumenten)) {
    return;
  }

  for (const dokument of dokumenten) {
    factsOfCasesSect.add(
      doc.struct("P", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            `Beweis K${currentDocumentIndex + 1}: `,
            MARGIN_RIGHT_SPACE,
            undefined,
            {
              continued: true,
            },
          )
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(dokument.beschreibung ?? "")
          .moveDown(1);
      }),
    );
  }
};

const addWitnessOfCase = (
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

export const addFactsOfCases = (
  doc: PDFKit.PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  { abschnitte }: GeldEinklagenFormularUserData,
) => {
  if (!arrayIsNonEmpty(abschnitte)) {
    return;
  }

  const factsOfCasesSect = doc.struct("Sect");

  factsOfCasesSect.add(
    doc.struct("H3", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(FACTS_OF_CASES_TEXT)
        .moveDown(1);
    }),
  );

  reasonSect.add(factsOfCasesSect);

  let currentDocumentIndex = 0;

  for (const abschnitt of abschnitte) {
    factsOfCasesSect.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(abschnitt.beschreibung, PDF_MARGIN_HORIZONTAL, undefined)
          .moveDown(1);

        addDocumentsFactsOfCase(
          doc,
          factsOfCasesSect,
          abschnitt.dokumenten,
          currentDocumentIndex,
        );
        addWitnessOfCase(doc, factsOfCasesSect, abschnitt.personen);

        currentDocumentIndex += abschnitt.dokumenten?.length ?? 0;
      }),
    );
  }

  doc.moveDown(1.5);
};
