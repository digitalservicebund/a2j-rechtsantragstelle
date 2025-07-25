import type { ArrayData, UserData } from "~/domains/userData";
import type { ArrayConfigServer, ArrayConfigClient } from ".";

export type ArraySummaryData =
  | Record<
      string,
      {
        data: ArrayData;
        configuration: ArrayConfigClient;
      }
    >
  | undefined;

export function getArraySummaryData(
  categories: string[],
  arrayConfigurations: Record<string, ArrayConfigServer> | undefined,
  userData: UserData,
): ArraySummaryData {
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
        const disableAddButton =
          arrayConfiguration.shouldDisableAddButton?.(userData) ?? false;
        const possibleArray = userData[category];
        const data = Array.isArray(possibleArray) ? possibleArray : [];
        return [
          category,
          { data, configuration: { ...arrayConfiguration, disableAddButton } },
        ];
      }),
  );
}
