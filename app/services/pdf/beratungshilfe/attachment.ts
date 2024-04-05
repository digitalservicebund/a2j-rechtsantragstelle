import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getMaritalDescriptionByContext } from "./sections/header";

const MAXIMUM_LENGTH_MARITAL_DESCRIPTION = 10;
export const MARITAL_STATUS_TITLE = "Familienstand:";
export const newPageHint = "Bitte im Anhang prüfen";

export type Attachment = {
  descriptions: { title: string; text: string }[];
  shouldCreateAttachment: boolean;
};

export function createAttachment(context: BeratungshilfeFormularContext) {
  const descriptions: Attachment["descriptions"] = [];
  let shouldCreateAttachment = false;
  const maritalDescription = getMaritalDescriptionByContext(context);

  if (maritalDescription.length > MAXIMUM_LENGTH_MARITAL_DESCRIPTION) {
    descriptions.push({
      title: MARITAL_STATUS_TITLE,
      text: maritalDescription,
    });
    shouldCreateAttachment = true;
  }

  return {
    descriptions,
    shouldCreateAttachment,
  } satisfies Attachment;
}
