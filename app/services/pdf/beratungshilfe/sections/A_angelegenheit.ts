import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { newPageHint, type Attachment } from "../../attachment";

const FIELD_A_RECHTSPROBLEMS_TITLE = "Feld A Rechtsproblems";
export const THEMA_RECHTSPROBLEM_TITLE = "Thema des Rechtsproblems:";
export const GEGNER_TITLE = "Gegner:";
export const BESCHREIBUNG_ANGELEGENHEIT_TITLE = "Beschreibung Angelegenheit:";
export const ZIEL_ANGELEGENHEIT_TITLE = "Ziel der Angelegenheit:";
export const EIGENBEMUEHUNG_TITLE = "Eigenbemühung:";
const MAX_LENGTH_ANGELEGENHEIT = 255;

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

export function fillAngelegenheit(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const angelegenheitDescriptions =
    getAngelegenheitAttachmentDescriptions(context);

  const sachverhaltString = angelegenheitDescriptions
    .map((x) => `${x.title} ${x.text}`)
    .join("\n");

  if (sachverhaltString.length > MAX_LENGTH_ANGELEGENHEIT) {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      newPageHint;

    attachment.push({ title: "", text: "" });
    attachment.push({
      title: FIELD_A_RECHTSPROBLEMS_TITLE,
      text: "",
    });

    attachment.push(...angelegenheitDescriptions);
  } else {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      sachverhaltString;
  }
}

function getAngelegenheitAttachmentDescriptions(
  context: BeratungshilfeFormularContext,
): Attachment {
  const attachment: Attachment = [];

  if (context.bereich) {
    attachment.push({
      title: THEMA_RECHTSPROBLEM_TITLE,
      text: bereichMapping[context.bereich],
    });
  }

  if (context.gegenseite) {
    attachment.push({
      title: GEGNER_TITLE,
      text: context.gegenseite,
    });
  }

  if (context.beschreibung) {
    attachment.push({
      title: BESCHREIBUNG_ANGELEGENHEIT_TITLE,
      text: context.beschreibung,
    });
  }

  if (context.ziel) {
    attachment.push({
      title: ZIEL_ANGELEGENHEIT_TITLE,
      text: context.ziel,
    });
  }

  if (context.eigeninitiativeBeschreibung) {
    attachment.push({
      title: EIGENBEMUEHUNG_TITLE,
      text: context.eigeninitiativeBeschreibung,
    });
  }

  return attachment;
}
