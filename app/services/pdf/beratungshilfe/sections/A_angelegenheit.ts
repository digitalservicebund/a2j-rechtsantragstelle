import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import type { BerHPdfFillFunction } from "..";
import {
  SEE_IN_ATTACHMENT_DESCRIPTION,
  type AttachmentEntries,
} from "../../attachment";

export const THEMA_RECHTSPROBLEM_TITLE = "Thema des Rechtsproblems";
export const GEGNER_TITLE = "Gegner";
export const BESCHREIBUNG_ANGELEGENHEIT_TITLE = "Beschreibung Angelegenheit";
export const ZIEL_ANGELEGENHEIT_TITLE = "Ziel der Angelegenheit";
export const EIGENBEMUEHUNG_TITLE = "Eigenbemühung";
const SACHVERHALT_FIELD_MAX_CHARS = 255;
const SACHVERHALT_FIELD_MAX_NEW_LINES = 4;

const bereichMapping = {
  authorities: "Behörden",
  living: "Wohnen",
  work: "Arbeit",
  separation: "Trennung & Unterhalt",
  trade: "Handel & Verträge",
  debt: "Schulden & Forderungen",
  inheritance: "Erben",
  criminalProcedure: "Strafverfahren",
  other: "Sonstiges",
};

export const fillAngelegenheit: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const attachment: AttachmentEntries = [];
  const angelegenheitDescriptions =
    getAngelegenheitAttachmentDescriptions(userData);

  const sachverhaltString = angelegenheitDescriptions
    .map((x) => `${x.title} ${x.text}`)
    .join("\n");

  const overflowDueToMaxChars =
    sachverhaltString.length > SACHVERHALT_FIELD_MAX_CHARS;
  const overflowDueToMaxNewLines =
    sachverhaltString.split("\n").length > SACHVERHALT_FIELD_MAX_NEW_LINES;

  if (overflowDueToMaxChars || overflowDueToMaxNewLines) {
    pdfValues.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;

    attachment.push({
      title: "Feld A: Das Rechtsproblem",
      level: "h2",
    });

    attachment.push(...angelegenheitDescriptions);
  } else {
    pdfValues.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      sachverhaltString;
  }
  return { pdfValues, attachment };
};

function getAngelegenheitAttachmentDescriptions(
  userData: BeratungshilfeFormularContext,
): AttachmentEntries {
  const attachment: AttachmentEntries = [];

  if (userData.bereich) {
    attachment.push({
      title: THEMA_RECHTSPROBLEM_TITLE,
      text: bereichMapping[userData.bereich],
    });
  }

  if (userData.gegenseite) {
    attachment.push({
      title: GEGNER_TITLE,
      text: userData.gegenseite,
    });
  }

  if (userData.beschreibung) {
    attachment.push({
      title: BESCHREIBUNG_ANGELEGENHEIT_TITLE,
      text: userData.beschreibung,
    });
  }

  if (userData.ziel) {
    attachment.push({
      title: ZIEL_ANGELEGENHEIT_TITLE,
      text: userData.ziel,
    });
  }

  if (userData.eigeninitiativeBeschreibung) {
    attachment.push({
      title: EIGENBEMUEHUNG_TITLE,
      text: userData.eigeninitiativeBeschreibung,
    });
  }

  return attachment;
}
