import type { Context } from "~/flows/contexts";
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
      .map((category) => category)
      .filter((category) => category in arrayConfigurations)
      .map((category) => {
        const arrayConfiguration = arrayConfigurations[category];
        const possibleArray = userData[category];
        const data = Array.isArray(possibleArray) ? possibleArray : [];
        return [
          category,
          {
            data,
            arrayConfiguration: {
              ...arrayConfiguration,
              statementValue:
                userData[arrayConfiguration.statementKey] === "yes",
            },
          },
        ];
      }),
  );
}
