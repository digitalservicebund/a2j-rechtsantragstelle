import type { AllUserDataKeys, UserData } from "~/domains/userData";

export const arrayChar = "#";
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
  nestedArrays?: Record<string, ArrayConfigServer>;
};

export type ArrayConfigClient = Omit<
  ArrayConfigServer,
  "statementKey" | "shouldDisableAddButton" | "event"
> & {
  disableAddButton: boolean;
};
