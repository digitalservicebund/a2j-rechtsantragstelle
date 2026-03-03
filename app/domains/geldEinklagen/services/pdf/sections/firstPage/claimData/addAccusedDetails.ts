import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { SEPARATOR } from "./addPlaintiffDetails";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { getFullPlaintiffName } from "~/domains/fluggastrechte/services/pdf/sections/getFullPlaintiffName";

export const addAccusedDetails = (
  doc: typeof PDFDocument,
  {
    beklagteAnrede,
    beklagteTitle,
    beklagteVorname,
    beklagteNachname,
    beklagteStrasseHausnummer,
    beklagteOrt,
    beklagtePlz,
    beklagteNameOrganisation,
    beklagteGesetzlichenVertretungAnrede,
    beklagteGesetzlichenVertretungTitle,
    beklagteGesetzlichenVertretungVorname,
    beklagteGesetzlichenVertretungNachname,
    gegenWenBeklagen,
  }: GeldEinklagenFormularUserData,
) => {
  const accusedPersonName = getFullPlaintiffName(
    beklagteAnrede,
    beklagteTitle === "none" ? "" : beklagteTitle,
    beklagteVorname,
    beklagteNachname,
  );

  const legalRepresentativeName = getFullPlaintiffName(
    beklagteGesetzlichenVertretungAnrede,
    beklagteGesetzlichenVertretungTitle === "none"
      ? ""
      : beklagteGesetzlichenVertretungTitle,
    beklagteGesetzlichenVertretungVorname,
    beklagteGesetzlichenVertretungNachname,
  );

  const legalRepresentative = `${beklagteNameOrganisation}, vertreten durch ${legalRepresentativeName}`;

  const accusedName =
    gegenWenBeklagen === "person" ? accusedPersonName : legalRepresentative;

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(accusedName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(
      `${beklagteStrasseHausnummer}, ${beklagtePlz} ${beklagteOrt}, Deutschland`,
    )
    .text("- Beklagte Partei -");
};
