import { type HeadingProps } from "~/components/common/Heading";
import type {
  AllowedUserTypes,
  ArrayData,
  SchemaObject,
  UserData,
} from "~/domains/userData";
import type { ArrayConfigServer, ArrayConfigClient } from ".";
import { type StrapiContentComponent } from "../cms/models/formElements/StrapiContentComponent";
import { type ZodType } from "zod";
import { isZodObject } from "~/components/formElements/schemaToForm/renderZodObject";
import { getNestedSchema } from "~/components/formElements/schemaToForm/getNestedSchema";
import { processSpecialFieldDisplay } from "~/services/processSpecialFieldDisplay";

export type ItemLabels = Record<string, string>;

export type ArraySummaryData =
  | Record<
      string,
      {
        data: ArrayData;
        configuration: ArrayConfigClient;
        title?: HeadingProps;
        description?: string;
        subtitle?: HeadingProps;
        buttonLabel: string;
        itemLabels: ItemLabels;
      }
    >
  | undefined;

function encodeSpecialFields(
  inputArray: ArrayData,
  arraySchema: SchemaObject[string],
): ArrayData {
  const innerSchema = getNestedSchema(arraySchema);
  if (!isZodObject(innerSchema)) {
    return inputArray;
  }
  let encodedData = inputArray;
  Object.entries(innerSchema.shape).forEach(
    ([fieldName, schema]: [string, ZodType<AllowedUserTypes>]) => {
      encodedData = encodedData.map((item) => ({
        ...item,
        [fieldName]: processSpecialFieldDisplay(item[fieldName], schema),
      }));
    },
  );
  return encodedData;
}

export function getArraySummaryData(
  categories: string[],
  arrayConfigurations: Record<string, ArrayConfigServer> | undefined,
  userData: UserData,
  content: StrapiContentComponent[],
  relevantPageSchemas: SchemaObject,
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
        const data = Array.isArray(possibleArray)
          ? encodeSpecialFields(possibleArray, relevantPageSchemas[category])
          : [];

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
            buttonLabel: arraySummaryCategoryContent?.buttonLabel ?? "",
            itemLabels: arraySummaryCategoryContent?.itemLabels ?? {},
          },
        ];
      }),
  );
}
