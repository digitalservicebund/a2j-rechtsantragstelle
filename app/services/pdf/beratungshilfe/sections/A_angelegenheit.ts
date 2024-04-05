import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { newPageHint, type Attachment } from "../attachment";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";

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

  const shouldCreateAttachment =
    angelegenheitDescriptions.map((x) => x.title + x.text).join(" ").length >
    MAX_LENGTH_ANGELEGENHEIT;

  if (shouldCreateAttachment) {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      newPageHint;

    attachment.shouldCreateAttachment = true;

    attachment.descriptions.push({ title: "", text: "" });
    attachment.descriptions.push({
      title: FIELD_A_RECHTSPROBLEMS_TITLE,
      text: "",
    });

    attachment.descriptions.push(...angelegenheitDescriptions);
  } else {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      angelegenheitDescriptions.map((x) => `${x.title} ${x.text}`).join("\n");
  }
}

function getAngelegenheitAttachmentDescriptions(
  context: BeratungshilfeFormularContext,
): Attachment["descriptions"] {
  const descriptions: Attachment["descriptions"] = [];

  if (context.bereich) {
    descriptions.push({
      title: THEMA_RECHTSPROBLEM_TITLE,
      text: bereichMapping[context.bereich],
    });
  }

  if (context.gegenseite) {
    descriptions.push({
      title: GEGNER_TITLE,
      text: context.gegenseite,
    });
  }

  if (context.beschreibung) {
    descriptions.push({
      title: BESCHREIBUNG_ANGELEGENHEIT_TITLE,
      text: context.beschreibung,
    });
  }

  if (context.ziel) {
    descriptions.push({
      title: ZIEL_ANGELEGENHEIT_TITLE,
      text: context.ziel,
    });
  }

  if (context.eigeninitiativeBeschreibung) {
    descriptions.push({
      title: EIGENBEMUEHUNG_TITLE,
      text: context.eigeninitiativeBeschreibung,
    });
  }

  return descriptions;
}
