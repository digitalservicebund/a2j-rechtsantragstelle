import type { ArrayData, Context } from "~/domains/contexts";
import type { ArrayConfigFlow, ArrayConfig } from ".";

export function getArraySummaryData(
  categories: string[],
  arrayConfigurations: Record<string, ArrayConfigFlow> | undefined,
  userData: Context,
):
  | Record<
      string,
      {
        data: ArrayData;
        configuration: ArrayConfig;
      }
    >
  | undefined {
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
