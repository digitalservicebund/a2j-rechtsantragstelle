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
    doc.text("gesetzlich vertreten durch:");
    for (const representative of representatives) {
      doc.text(
        `${getGesetzlicheVertretungArtLabel(representative.art)}, ${formatRepresentativeName(representative)}, ${formatAddress(representative)}`,
      );
    }
  }
  doc.text(`– ${label} zu ${number} –`, { align: "right" });
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
      `${getGesetzlicheVertretungArtLabel(party.orgVertretungArt)}, ${getFullPlaintiffName(
        party.orgVertretungAnrede,
        party.orgVertretungTitel,
        party.orgVertretungVorname,
        party.orgVertretungNachname,
      )}`,
    );

  for (const representative of party["gesetzliche-vertretung"] ?? []) {
    doc.text(
      `${getGesetzlicheVertretungArtLabel(representative.art)}, ${formatRepresentativeName(representative)}, ${formatAddress(representative)}`,
    );
  }

  doc.text(`– ${label} zu ${number} –`, { align: "right" });
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
      doc.moveDown();
    }),
  );

  const label = relationship === "klagende" ? "Kläger" : "Beklagter";
  getOrderedKlageParties(userData, relationship).forEach(
    ({ partei, displayIndex }) => {
      const partyParagraph = doc.struct("P", {}, () => {
        doc.fontSize(10);
        if (partei.type === "natuerliche-person") {
          addNaturalPerson(doc, partei, displayIndex + 1, label);
        } else {
          addOrganization(doc, partei, displayIndex + 1, label);
        }
        doc.moveDown();
      });
      claimantSection.add(partyParagraph);
    },
  );
};
