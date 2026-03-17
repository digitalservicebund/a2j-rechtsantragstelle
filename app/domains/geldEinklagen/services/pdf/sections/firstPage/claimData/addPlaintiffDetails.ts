import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { getFullPlaintiffName } from "~/domains/fluggastrechte/services/pdf/sections/getFullPlaintiffName";

export const PLAINTIFF_TEXT = "- Klagende Partei -";
export const SEPARATOR = " | ";

const formatContactInfo = (phone?: string, email?: string): string => {
  const parts = [phone, email].filter(Boolean);
  return parts.join(` ${SEPARATOR} `);
};

export const addPlaintiffDetails = (
  doc: typeof PDFDocument,
  {
    klagendePersonAnrede,
    klagendePersonTitle,
    klagendePersonVorname,
    klagendePersonNachname,
    klagendePersonStrasseHausnummer,
    klagendePersonPlz,
    klagendePersonOrt,
    klagendeTelefonnummer,
    klagendeEmail,
  }: GeldEinklagenFormularUserData,
) => {
  const plaintiffName = getFullPlaintiffName(
    klagendePersonAnrede,
    klagendePersonTitle === "none" ? "" : klagendePersonTitle,
    klagendePersonVorname,
    klagendePersonNachname,
  );
  const address = klagendePersonStrasseHausnummer ?? "";
  const zipCode = klagendePersonPlz ?? "";
  const city = klagendePersonOrt ?? "";
  const contactInfo =
    formatContactInfo(klagendeTelefonnummer, klagendeEmail) || "";

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(plaintiffName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(`${address}, ${zipCode} ${city}, Deutschland`)
    .text(contactInfo)
    .text(PLAINTIFF_TEXT, { align: "left" });
};
