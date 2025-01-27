import type { AllContextKeys } from "~/domains/common";
import type { Context } from "~/domains/contexts";

export const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldName: string) =>
  fieldName.includes(arrayChar);

export type ArrayConfigServer = {
  event: `add-${AllContextKeys}`;
  url: string;
  initialInputUrl: string;
  statementKey: AllContextKeys;
  customStartDisplayIndex?: number;
  shouldDisableAddButton?: (context: Context) => boolean;
  hiddenFields?: string[];
};

export type ArrayConfigClient = Omit<
  ArrayConfigServer,
  "statementKey" | "shouldDisableAddButton"
> & {
  disableAddButton: boolean;
};
