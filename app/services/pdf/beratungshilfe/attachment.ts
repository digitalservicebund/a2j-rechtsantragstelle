import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";

export function createAttachment(
  context: BeratungshilfeFormularContext,
  maxLength = 255,
) {
  const descriptions: Attachment["descriptions"] = [];

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
      title: "Thema des Rechtsproblems:",
      text: bereichMapping[context.bereich],
    });
  }

  if (context.beschreibung) {
    descriptions.push({
      title: "Beschreibung Angelegenheit:",
      text: context.beschreibung,
    });
  }

  if (context.eigeninitiativeBeschreibung) {
    descriptions.push({
      title: "Eigenbemühungen:",
      text: context.eigeninitiativeBeschreibung,
    });
  } else if (context.keineEigeninitiativeBeschreibung) {
    descriptions.push({
      title: "Keine Eigenbemühung, weil:",
      text: context.keineEigeninitiativeBeschreibung,
    });
  }

  if (context.sonstiges) {
    descriptions.push({
      title: "Weitere Anmerkung:",
      text: context.sonstiges,
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
