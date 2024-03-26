import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getMaritalDescriptionByContext } from "./sections/header";

const MAXIMUM_LENGTH_MARITAL_DESCRIPTION = 10;
export const MARITAL_STATUS_TITLE = "Familienstand:";
export const THEMA_RECHTSPROBLEM_TITLE = "Thema des Rechtsproblems:";
export const GEGNER_TITLE = "Gegner:";
export const BESCHREIBUNG_ANGELEGENHEIT_TITLE = "Beschreibung Angelegenheit:";
export const ZIEL_ANGELEGENHEIT_TITLE = "Ziel der Angelegenheit:";
export const EIGENBEMUEHUNG_TITLE = "Eigenbemühung:";

export function createAttachment(
  context: BeratungshilfeFormularContext,
  maxLength = 255,
) {
  const descriptions: Attachment["descriptions"] = [];

  addMaritalToAttachment({ descriptions, context });

  if (context.bereich) {
    // TODO move to another function and use strapi as a source
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

  const shouldCreateAttachment =
    descriptions.map((x) => x.title + x.text).join(" ").length > maxLength;

  return {
    descriptions,
    shouldCreateAttachment,
  } satisfies Attachment;
}

export const newPageHint = "Bitte im Anhang prüfen";

export type Attachment = {
  descriptions: { title: string; text: string }[];
  shouldCreateAttachment: boolean;
};

type MaritalAttachment = {
  descriptions: Attachment["descriptions"];
  context: BeratungshilfeFormularContext;
};

const addMaritalToAttachment = ({
  context,
  descriptions,
}: MaritalAttachment): void => {
  const maritalDescription = getMaritalDescriptionByContext(context);

  if (maritalDescription.length > MAXIMUM_LENGTH_MARITAL_DESCRIPTION) {
    descriptions.push({
      title: MARITAL_STATUS_TITLE,
      text: maritalDescription,
    });
  }
};
