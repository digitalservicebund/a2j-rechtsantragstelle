import type { AllUserDataKeys, UserData } from "~/domains/userData";

export const arrayChar = "#";
export const EDIT_BUTTON_ID_PREFIX = "array-summary-item-edit-";
export const fieldIsArray = (fieldName: string) =>
  fieldName.includes(arrayChar);

export type AddArrayItemEvent = `add-${AllUserDataKeys}`;

export type ArrayConfigServer = {
  url: string;
  initialInputUrl: string;
  isArrayRelevant?: (context: UserData) => boolean;
  displayIndexOffset?: number;
  shouldDisableAddButton?: (context: UserData) => boolean;
  hiddenFields?: string[];
};

export type ArrayConfigClient = Pick<
  ArrayConfigServer,
  "url" | "initialInputUrl" | "hiddenFields" | "displayIndexOffset"
> & {
  disableAddButton: boolean;
};
