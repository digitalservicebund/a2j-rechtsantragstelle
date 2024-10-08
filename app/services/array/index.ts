import type { AllContextKeys } from "~/flows/common";

export const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldname: string) =>
  fieldname.includes(arrayChar);

export type ArrayConfig = {
  event: `add-${AllContextKeys}`;
  url: string;
  initialInputUrl: string;
  statementKey: AllContextKeys;
  statementUrl?: string;
  statementValue?: boolean;
  hiddenFields?: string[];
};
