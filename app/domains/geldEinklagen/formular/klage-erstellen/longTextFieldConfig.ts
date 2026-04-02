import { isKeyOfObject } from "~/util/objects";
import { type GeldEinklagenFormularKlageErstellenUserData } from "./userData";

/* 
This is a workaround to have different textarea row counts for specific fields
without hardcoding field names in the Textarea component.
Future improvement could be: The component should decide
whether to render the scrollable container based on the content itself
*/

const LONG_TEXT_FIELD_ROWS = 10;

const GeldEinklagenTextAreaConfig = {
  sachverhaltBegruendung: LONG_TEXT_FIELD_ROWS,
  beweiseBeschreibung: LONG_TEXT_FIELD_ROWS,
  weitereAntraege: LONG_TEXT_FIELD_ROWS,
  rechtlicheWuerdigung: LONG_TEXT_FIELD_ROWS,
} as const satisfies Readonly<
  Partial<Record<keyof GeldEinklagenFormularKlageErstellenUserData, number>>
>;

export const isGeldEinklagenLongTextField = (fieldName: string) =>
  isKeyOfObject(fieldName, GeldEinklagenTextAreaConfig);

export const getGeldEinklagenTextareaRows = (fieldName: string) =>
  isGeldEinklagenLongTextField(fieldName)
    ? GeldEinklagenTextAreaConfig[fieldName]
    : undefined;
