import type { AllContextKeys } from "~/flows/common";
import type { BasicTypes } from "~/flows/contexts";

export const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldname: string) =>
  fieldname.includes(arrayChar);

export type ArrayConfig = {
  event: `add-${AllContextKeys}`;
  url: string;
  initialInputUrl: string;
  statementUrl: string;
  statementKey: AllContextKeys | "showAlways";
  statementValue?: boolean;
  hiddenFields?: string[];
  /**
   * Optional mutation function to add display-only fields to the array
   * @param items items in the ArraySummary
   * @returns Modified ArraySummary items
   */
  arrayDataModifier?: (
    items: Record<string, BasicTypes>[],
  ) => Record<string, BasicTypes>[];
};
