import { useField } from "@rvf/react";
import mapKeys from "lodash/mapKeys";
import times from "lodash/times";
import { useLocation } from "react-router";
import { ZodOptional, type ZodObject } from "zod";
import HiddenInput from "~/components/formElements/HiddenInput";
import { SchemaComponents } from "~/components/formElements/SchemaComponents";
import { getNestedSchema } from "~/components/formElements/schemaToForm/getNestedSchema";
import { type NestedKinder } from "~/domains/erbschein/wegweiser/pages";
import { getPageSchema } from "~/domains/pageSchemas";
import { type SchemaObject } from "~/domains/userData";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { type StrapiDynamicArray } from "~/services/cms/models/formElements/StrapiDynamicArraySchema";

export const DynamicArray = (props: StrapiDynamicArray) => {
  const {
    name,
    dynamicArrayGroup: { formComponents },
  } = props;
  const { pathname } = useLocation();
  const pageSchema = getPageSchema(pathname);
  const { count: numberOfArrayItems } = useField<NestedKinder>(name).value();

  if (!pageSchema) return null;

  /**
   * Needed to ensure that SchemaComponents doesn't infinitely recurse into entries.kinder.entries.kinder etc.
   * Also removes ZodOptionals to avoid validating non-relevant array item properties
   */
  const nonRecursiveArrayItem: SchemaObject = Object.fromEntries(
    Object.entries(
      getNestedSchema((pageSchema[name] as ZodObject).shape.entries)
        .shape as ZodObject,
    ).filter(([_, schema]) => !(schema instanceof ZodOptional)),
  );

  return (
    <>
      <HiddenInput name={`${name}.count`} />
      {times(numberOfArrayItems ?? 0, (idx) => (
        <SchemaComponents
          key={idx}
          pageSchema={
            mapKeys(
              nonRecursiveArrayItem,
              (_, key) => `${name}.entries[${idx}]${key}`,
            ) as SchemaObject
          }
          formComponents={formComponents.map((component) => ({
            ...component,
            name: resolveArrayCharacter(component.name, [idx]),
          }))}
        />
      ))}
    </>
  );
};
