import { type HeadingProps } from "~/components/Heading";
import type { ArrayData, UserData } from "~/domains/userData";
import type { ArrayConfigServer, ArrayConfigClient } from ".";
import { type StrapiContentComponent } from "../cms/models/StrapiContentComponent";

export type ArraySummaryData =
  | Record<
      string,
      {
        data: ArrayData;
        configuration: ArrayConfigClient;
        title?: HeadingProps;
        description?: string;
        subtitle?: HeadingProps;
        buttonLabel?: string;
        itemsContent: Array<{ item: string; value: string }>;
      }
    >
  | undefined;

export function getArraySummaryData(
  categories: string[],
  arrayConfigurations: Record<string, ArrayConfigServer> | undefined,
  userData: UserData,
  content: StrapiContentComponent[],
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

        const arraySummaryCategoryContent = content
          .filter((value) => value.__component === "page.array-summary")
          .find((value) => value.category === category);

        return [
          category,
          {
            data,
            configuration: { ...arrayConfiguration, disableAddButton },
            title: arraySummaryCategoryContent?.title,
            subtitle: arraySummaryCategoryContent?.subtitle,
            description: arraySummaryCategoryContent?.description,
            buttonLabel: arraySummaryCategoryContent?.buttonLabel,
            itemsContent: arraySummaryCategoryContent?.items ?? [],
          },
        ];
      }),
  );
}
