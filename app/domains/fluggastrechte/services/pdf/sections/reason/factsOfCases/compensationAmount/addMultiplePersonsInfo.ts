import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import {
  MARGIN_BETWEEN_SECTIONS,
  MARGIN_RIGHT,
} from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { arrayIsNonEmpty } from "~/util/array";
import { getFullPlaintiffName } from "../../../getFullPlaintiffName";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const CLAIM_FOLLOWING_PERSONS_TRANSFERER_TEXT =
  "Die Ansprüche folgender Personen wurden durch Abtretung gemäß § 398 BGB an die klagende Partei übertragen:";
export const ATTACHMENT_ASSIGNMENTS_TEXT = "Beweis: Anlage Abtretungen";
const INFORMATION_BOOKING_AND_ASSIGNMENTS_SECOND_PART_TEXT =
  "Reiseverlauf, Beteiligung der genannten Personen und Abtretungen wird für den Fall des Bestreitens";
export const INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT = `Für sämtliche Angaben, insbesondere zu Buchungen, Check-in, Boarding, ${INFORMATION_BOOKING_AND_ASSIGNMENTS_SECOND_PART_TEXT}`;
export const INFORMATION_BOOKING_AND_ASSIGNMENTS_ANNULLIERUNG_TEXT = `Für sämtliche Angaben, insbesondere zu Buchungen, ${INFORMATION_BOOKING_AND_ASSIGNMENTS_SECOND_PART_TEXT}`;
export const EVIDENCE_QUESTION_WITNESSES_TEXT =
  "Beweis angeboten durch Vernehmung der folgenden Personen als Zeugen:";

export const addMultiplePersonsInfo = (
  doc: typeof PDFDocument,
  {
    isWeiterePersonen,
    weiterePersonen,
    hasZeugen,
    bereich,
  }: FluggastrechtContext,
) => {
  if (isWeiterePersonen === "no" || !arrayIsNonEmpty(weiterePersonen)) {
    return;
  }

  addNewPageInCaseMissingVerticalSpace(doc);

  const personsNames = weiterePersonen
    .flatMap(({ anrede, title, nachname, vorname }) => {
      return `${getFullPlaintiffName(anrede, title, vorname, nachname)}`;
    })
    .join(", ");

  doc
    .text(CLAIM_FOLLOWING_PERSONS_TRANSFERER_TEXT)
    .text(personsNames)
    .font(FONTS_BUNDESSANS_BOLD)
    .moveDown(0.5)
    .text(ATTACHMENT_ASSIGNMENTS_TEXT, PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT)
    .font(FONTS_BUNDESSANS_REGULAR);

  addNewPageInCaseMissingVerticalSpace(doc);

  if (hasZeugen === "yes") {
    doc
      .moveDown(MARGIN_BETWEEN_SECTIONS)
      .text(
        bereich === "annullierung"
          ? INFORMATION_BOOKING_AND_ASSIGNMENTS_ANNULLIERUNG_TEXT
          : INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT,
        PDF_MARGIN_HORIZONTAL,
      )
      .font(FONTS_BUNDESSANS_BOLD)
      .moveDown(0.5)
      .text(
        EVIDENCE_QUESTION_WITNESSES_TEXT,
        PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      )
      .font(FONTS_BUNDESSANS_REGULAR)
      .text(personsNames)
      .moveDown(0.5);
  }
};
