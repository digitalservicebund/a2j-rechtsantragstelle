import type { Context } from "~/domains/contexts";
import type { ArrayConfig } from ".";

export function getSummaryData(
  categories: string[],
  arrayConfigurations: Record<string, ArrayConfig> | undefined,
  userData: Context,
) {
  if (!arrayConfigurations) {
    return undefined;
  }

  return Object.fromEntries(
    categories
      .filter(
        (category) =>
          category in arrayConfigurations &&
          userData[arrayConfigurations[category].statementKey] === "yes",
      )
      .map((category) => {
        const arrayConfiguration = arrayConfigurations[category];
        arrayConfiguration.disableAddButton =
          arrayConfiguration.shouldDisableAddButton
            ? arrayConfiguration.shouldDisableAddButton(userData)
            : false;
        const possibleArray = userData[category];
        const data = Array.isArray(possibleArray) ? possibleArray : [];
        return [category, { data, arrayConfiguration }];
      }),
  );
}
