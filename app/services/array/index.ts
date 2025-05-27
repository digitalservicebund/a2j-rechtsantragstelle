import type { AllUserDataKeys } from "~/domains/common";
import type { UserData } from "~/domains/userData";

export const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldName: string) =>
  fieldName.includes(arrayChar);

export type ArrayConfigServer = {
  event: `add-${AllUserDataKeys}`;
  url: string;
  initialInputUrl: string;
  statementKey: AllUserDataKeys;
  displayIndexOffset?: number;
  shouldDisableAddButton?: (context: UserData) => boolean;
  hiddenFields?: string[];
};

export type ArrayConfigClient = Omit<
  ArrayConfigServer,
  "statementKey" | "shouldDisableAddButton"
> & {
  disableAddButton: boolean;
};
