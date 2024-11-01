import type { AllContextKeys } from "~/domains/common";

export const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldname: string) =>
  fieldname.includes(arrayChar);

export type ArrayConfig = {
  event: `add-${AllContextKeys}`;
  url: string;
  initialInputUrl: string;
  statementKey: AllContextKeys;
  hiddenFields?: string[];
};
