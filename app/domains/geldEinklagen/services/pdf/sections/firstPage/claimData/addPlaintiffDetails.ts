import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { getFullPlaintiffName } from "~/domains/fluggastrechte/services/pdf/sections/getFullPlaintiffName";

export const PLAINTIFF_TEXT = "- Klagende Partei -";
export const SEPARATOR = " | ";

export const formatAddress = (
  strasse?: string,
  hausnummer?: string,
  plz?: string,
  ort?: string,
): string => {
  const streetAndNumber = [strasse, hausnummer].filter(Boolean).join(" ");
  const addressParts = [streetAndNumber, `${plz} ${ort}`].filter(Boolean);
  return (
    addressParts.join(", ") +
    (addressParts.length > 0 ? ", " : "") +
    "Deutschland"
  );
};

export const addPlaintiffDetails = (
  doc: PDFKit.PDFDocument,
  plaintiffDetailsParagraph: PDFKit.PDFStructureElement,
  {
    klagendePersonAnrede,
    klagendePersonTitle,
    klagendePersonVorname,
    klagendePersonNachname,
    klagendePersonStrasse,
    klagendePersonHausnummer,
    klagendePersonPlz,
    klagendePersonOrt,
    klagendeTelefonnummer,
    klagendeEmail,
  }: GeldEinklagenFormularUserData,
) => {
  const plaintiffName = getFullPlaintiffName(
    klagendePersonAnrede,
    klagendePersonTitle,
    klagendePersonVorname,
    klagendePersonNachname,
  );

  const address = formatAddress(
    klagendePersonStrasse,
    klagendePersonHausnummer,
    klagendePersonPlz,
    klagendePersonOrt,
  );

  const hasEmail = Boolean(klagendeEmail);

  plaintiffDetailsParagraph.add(
    doc.struct("Span", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(plaintiffName, { continued: true })
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(SEPARATOR, { continued: true })
        .text(address);
    }),
  );

  if (klagendeTelefonnummer) {
    plaintiffDetailsParagraph.add(
      doc.struct("Link", {}, () => {
        doc.text(klagendeTelefonnummer, {
          link: `tel:${klagendeTelefonnummer.trim()}`,
          continued: hasEmail,
        });

        if (hasEmail) {
          doc.text(SEPARATOR, { continued: true });
        }
      }),
    );
  }

  if (hasEmail) {
    plaintiffDetailsParagraph.add(
      doc.struct("Link", { alt: klagendeEmail }, () => {
        doc.text(klagendeEmail ?? "", { link: `mailto:${klagendeEmail}` });
      }),
    );
  }

  plaintiffDetailsParagraph.add(
    doc.struct("Span", {}, () => {
      doc.text(PLAINTIFF_TEXT, { align: "left" });
    }),
  );
};
