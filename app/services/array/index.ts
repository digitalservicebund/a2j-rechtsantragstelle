import type { AllContextKeys } from "~/models/flows/common";

export const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldname: string) =>
  fieldname.includes(arrayChar);

export type ArrayConfig = {
  event: string;
  url: string;
  initialInputUrl: string;
  statementUrl: string;
  statementKey: AllContextKeys;
  statementValue?: boolean;
  hiddenFields?: string[];
};
