import type PDFDocument from "pdfkit";
import { getGesetzlicheVertretungArtLabel } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import type {
  KlageParteien,
  KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { getOrderedKlageParties } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyOrdering";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { addMissingData } from "./addMissingData";

type KlagePartei = KlageParteien[number];

const formatAddress = (
  address: Pick<KlagePartei, "strasse" | "hausnummer" | "plz" | "ort" | "land">,
) => {
  const streetAndNumber = [address.strasse, address.hausnummer]
    .filter(Boolean)
    .join(" ");
  const postalAddress = [address.plz, address.ort].filter(Boolean).join(" ");

  return [streetAndNumber, postalAddress, address.land]
    .filter(Boolean)
    .join(", ");
};

const formatRepresentativeName = (
  representative: Pick<
    Extract<KlagePartei, { type: "natuerliche-person" }>,
    "anrede" | "titel" | "vorname" | "nachname"
  >,
) =>
  getFullPlaintiffName(
    representative.anrede,
    representative.titel,
    representative.vorname,
    representative.nachname,
  );

const addNaturalPerson = (
  doc: PDFKit.PDFDocument,
  party: Extract<KlagePartei, { type: "natuerliche-person" }>,
  number: number,
  label: string,
) => {
  doc
    .font(FONTS_BUNDESSANS_BOLD)
    .text(formatRepresentativeName(party))
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(formatAddress(party));

  const representatives = party["gesetzliche-vertretung"] ?? [];

  if (representatives.length > 0) {
    doc.text("gesetzlich vertreten durch:", { indent: 8 });
    for (const representative of representatives) {
      doc
        .font(FONTS_BUNDESSANS_BOLD)
        .text(`${getGesetzlicheVertretungArtLabel(representative.art)}, `, {
          indent: 8,
          continued: true,
        });
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(formatRepresentativeName(representative));
      doc.text(formatAddress(representative), { indent: 6 });
    }
  }
  doc.text(`– ${label} zu ${number} –`, { align: "right" });
  doc.moveDown(2);
};

const addOrganization = (
  doc: PDFKit.PDFDocument,
  party: Extract<KlagePartei, { type: "organisation" }>,
  number: number,
  label: string,
) => {
  doc
    .font(FONTS_BUNDESSANS_BOLD)
    .text(party.orgName)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(formatAddress(party))
    .text("gesetzlich vertreten durch:")
    .text(
      `${getFullPlaintiffName(
        party.orgVertretungAnrede,
        party.orgVertretungTitel,
        party.orgVertretungVorname,
        party.orgVertretungNachname,
      )}`,
    );

  for (const representative of party["gesetzliche-vertretung"] ?? []) {
    doc
      .text(
        `${getGesetzlicheVertretungArtLabel(representative.art)}, ${formatRepresentativeName(representative)}`,
        { indent: 8 },
      )
      .text(formatAddress(representative), { indent: 8 });
  }

  doc.text(`– ${label} zu ${number} –`, { align: "right" });
  doc.moveDown(2);
};

export const addKlageParties = (
  doc: typeof PDFDocument,
  claimantSection: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
  relationship: KlageParteiVerhaeltnis,
) => {
  claimantSection.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(relationship === "klagende" ? "in der Sache" : "gegen");
      doc.moveDown(2);
    }),
  );

  const label = relationship === "klagende" ? "Kläger" : "Beklagter";
  const parties = getOrderedKlageParties(userData, relationship);
  if (parties.length === 0) {
    addMissingData(doc, claimantSection, label);
  }
  parties.forEach(({ partei, displayIndex }) => {
    const partyParagraph = doc.struct("P", {}, () => {
      doc.fontSize(10);
      if (partei.type === "natuerliche-person") {
        addNaturalPerson(doc, partei, displayIndex + 1, label);
      } else {
        addOrganization(doc, partei, displayIndex + 1, label);
      }
      doc.moveDown(2);
    });
    claimantSection.add(partyParagraph);
  });
};
