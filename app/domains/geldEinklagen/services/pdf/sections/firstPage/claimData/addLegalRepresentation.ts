import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import capitalize from "lodash/capitalize";
import { formatAddress } from "./addPlaintiffDetails";

const SEPARATOR = " | ";
const REPRESENTATION_LEGAL_TEXT = "Prozessbevollmächtigte";

const getRepresentationName = (userData: GeldEinklagenFormularUserData) => {
  const {
    klagendePersonAnwaltschaftKanzlei,
    klagendePersonAnwaltschaftAnrede,
    klagendePersonAnwaltschaftNachname,
    klagendePersonAnwaltschaftTitle,
    klagendePersonAnwaltschaftVorname,
  } = userData;

  const salutation =
    klagendePersonAnwaltschaftAnrede === "none"
      ? ""
      : capitalize(klagendePersonAnwaltschaftAnrede);
  const capitalizedVorname = capitalize(klagendePersonAnwaltschaftVorname);

  return [
    klagendePersonAnwaltschaftKanzlei
      ? `${klagendePersonAnwaltschaftKanzlei},`
      : "",
    salutation,
    klagendePersonAnwaltschaftTitle,
    capitalizedVorname,
    klagendePersonAnwaltschaftNachname,
  ]
    .filter(Boolean)
    .join(" ");
};

export const addLegalRepresentation = (
  doc: PDFKit.PDFDocument,
  legalRepresentationParagraph: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  if (userData.anwaltschaft === "no") {
    return;
  }

  const representationName = getRepresentationName(userData);
  const address = formatAddress(
    userData.klagendePersonAnwaltschaftStrasseHausnummer,
    userData.klagendePersonAnwaltschaftPlz,
    userData.klagendePersonAnwaltschaftOrt,
  );
  const businessIdentification =
    userData.klagendePersonAnwaltschaftGeschaeftszeichen
      ? `Geschäftszeichen: ${userData.klagendePersonAnwaltschaftGeschaeftszeichen}`
      : "";

  legalRepresentationParagraph.add(
    doc.struct("Span", {}, () => {
      doc
        .moveDown()
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(REPRESENTATION_LEGAL_TEXT)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(representationName, { continued: true })
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(SEPARATOR, { continued: true })
        .text(address)
        .text(businessIdentification);
    }),
  );

  const klagendePersonAnwaltschaftTelefonnummer =
    userData.klagendePersonAnwaltschaftTelefonnummer;
  const hasEmail = Boolean(userData.klagendePersonAnwaltschaftEmail);

  if (klagendePersonAnwaltschaftTelefonnummer) {
    legalRepresentationParagraph.add(
      doc.struct("Link", {}, () => {
        doc.text(klagendePersonAnwaltschaftTelefonnummer, {
          link: `tel:${klagendePersonAnwaltschaftTelefonnummer.trim()}`,
          continued: hasEmail,
        });

        if (hasEmail) {
          doc.text(SEPARATOR, { continued: true });
        }
      }),
    );
  }

  if (hasEmail) {
    legalRepresentationParagraph.add(
      doc.struct(
        "Link",
        { alt: userData.klagendePersonAnwaltschaftEmail },
        () => {
          doc.text(userData.klagendePersonAnwaltschaftEmail ?? "", {
            link: `mailto:${userData.klagendePersonAnwaltschaftEmail}`,
          });
        },
      ),
    );
  }
};
