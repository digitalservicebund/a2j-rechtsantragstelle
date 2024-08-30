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
   * Optional mapper function to modify the display of the ArraySummary
   * @param data ArraySummary record
   * @returns new, modified record
   */
  arrayDataMapper?: (
    data: Record<string, BasicTypes>,
  ) => Record<string, BasicTypes>;
};
