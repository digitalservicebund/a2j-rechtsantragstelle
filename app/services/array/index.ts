import type { AllContextKeys } from "~/domains/common";

export const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldName: string) =>
  fieldName.includes(arrayChar);

export type ArrayConfig = {
  event: `add-${AllContextKeys}`;
  url: string;
  initialInputUrl: string;
  statementKey: AllContextKeys;
  hiddenFields?: string[];
  shouldDisableAddButton?: () => boolean;
  disableAddButton?: boolean;
};
