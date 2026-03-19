import { type HeadingProps } from "~/components/common/Heading";
import type { ArrayData, SchemaObject, UserData } from "~/domains/userData";
import type { ArrayConfigServer, ArrayConfigClient } from ".";
import { type StrapiContentComponent } from "../cms/models/formElements/StrapiContentComponent";
import { ZodObject, type ZodType, type ZodArray, type ZodSchema } from "zod";
import { ibanZodDescription, type ZodIban } from "~/services/validation/iban";

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

function handleSpecialFieldDisplay(
  inputArray: ArrayData,
  arraySchema: ZodArray,
): ArrayData {
  const innerSchema = arraySchema.unwrap();
  let encodedData = inputArray;
  if (
    innerSchema instanceof ZodObject &&
    Object.values(innerSchema.shape).some(
      (schema: ZodSchema) => schema.meta()?.description === ibanZodDescription,
    )
  ) {
    Object.entries(innerSchema.shape).forEach(
      ([fieldName, schema]: [string, ZodType]) => {
        if (schema.meta()?.description === ibanZodDescription) {
          encodedData = encodedData.map((item) => ({
            ...item,
            [fieldName]: (schema as ZodIban).encode(item[fieldName] as string),
          }));
        }
      },
    );
  }
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
          ? handleSpecialFieldDisplay(
              possibleArray,
              relevantPageSchemas[category] as ZodArray,
            )
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
