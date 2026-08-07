import { MARGIN_RIGHT } from "~/domains/fluggastrechte/services/pdf/configurations";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";
import capitalize from "lodash/capitalize";

const bulletText = "•  ";
export const MARGIN_RIGHT_SPACE = PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT;

const WITNESS_TEXT =
  "Beweis angeboten durch Vernehmung der folgenden Personen als Zeugen oder Zeuginnen:";
const PARTY_WITNESS_TEXT =
  "Beweis angeboten durch Parteivernehmung der folgenden Personen:";

const formatAddress = (
  strasse?: string,
  hausnummer?: string,
  plz?: string,
  ort?: string,
  land?: string,
): string => {
  const streetAndNumber = [strasse, hausnummer].filter(Boolean).join(" ");
  const addressParts = [streetAndNumber, `${plz} ${ort}`, land].filter(Boolean);
  return addressParts.join(", ");
};

type Person = Exclude<
  GeldEinklagenFormularUserData["abschnitte"],
  undefined
>[number]["personen"] extends Array<infer TPerson> | undefined
  ? TPerson
  : never;

type AnotherPerson = Extract<Person, { personAuswahl: "anotherPerson" }>;
type PartyPerson = Extract<Person, { personAuswahl: "beklagte" | "klagende" }>;

const addBulletedWitnessList = <TPerson>(
  doc: PDFKit.PDFDocument,
  factsOfCasesSect: PDFKit.PDFStructureElement,
  items: TPerson[],
  captionText: string,
  renderItem: (doc: PDFKit.PDFDocument, item: TPerson) => void,
) => {
  if (items.length === 0) {
    return;
  }

  const witnessList = doc.struct("L");
  witnessList.add(
    doc.struct("Caption", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(captionText, MARGIN_RIGHT_SPACE, undefined);
    }),
  );

  for (const item of items) {
    const witnessListListItem = doc.struct("LI");

    witnessListListItem.add(
      doc.struct("LBody", {}, () => {
        doc
          .moveDown(0.5)
          .font(FONTS_BUNDESSANS_BOLD)
          .text(bulletText, MARGIN_RIGHT_SPACE + 3, undefined, {
            continued: true,
          });
        renderItem(doc, item);
      }),
    );
    witnessList.add(witnessListListItem);
  }

  factsOfCasesSect.add(witnessList);
  doc.moveDown(1);
};

const renderAnotherPersonItem = (
  doc: PDFKit.PDFDocument,
  person: AnotherPerson,
) => {
  const {
    anrede,
    email,
    hausnummer,
    land,
    nachname,
    ort,
    plz,
    strasse,
    title,
    telefonnummer,
    vorname,
  } = person;

  const salutation = anrede === "none" ? "" : capitalize(anrede);
  const plaintiffName = [salutation, title, vorname, nachname]
    .filter(Boolean)
    .join(" ");
  const address = formatAddress(strasse, hausnummer, plz, ort, land);
  const hasEmail = Boolean(email);
  const hasEmailOrPhone = Boolean(telefonnummer) || hasEmail;

  doc
    .text(`${plaintiffName} `, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(address, { continued: hasEmailOrPhone });

  if (telefonnummer) {
    doc.text(`, ${telefonnummer}`, { continued: hasEmail });
  }

  if (email) {
    doc.text(`, ${email}`, { continued: false });
  }
};

const renderPartyItem = (doc: PDFKit.PDFDocument, person: PartyPerson) => {
  const itemText =
    person.personAuswahl === "beklagte" ? "Beklagte Person" : "Klagende Person";

  doc.text(itemText).font(FONTS_BUNDESSANS_REGULAR);
};

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

  addBulletedWitnessList(
    doc,
    factsOfCasesSect,
    personenWithAnotherPerson,
    WITNESS_TEXT,
    renderAnotherPersonItem,
  );

  addBulletedWitnessList(
    doc,
    factsOfCasesSect,
    personenWithParty,
    PARTY_WITNESS_TEXT,
    renderPartyItem,
  );
};
