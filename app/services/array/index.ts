import type { AllUserDataKeys, UserData } from "~/domains/userData";

export const arrayChar = "#";
export const fieldIsArray = (fieldName: string) =>
  fieldName.includes(arrayChar);

export type ArrayConfigServer = {
  event: `add-${AllUserDataKeys}`;
  url: string;
  initialInputUrl: string;
  statementKey: AllUserDataKeys;
  /**
   * statementKey alternative. Used for complex conditionals to display the array summary.
   */
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
