import mapKeys from "lodash/mapKeys";
import omit from "lodash/omit";
import times from "lodash/times";
import { useLocation } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { type ZodObject } from "zod";
import { SchemaComponents } from "~/components/formElements/SchemaComponents";
import { getNestedSchema } from "~/components/formElements/schemaToForm/getNestedSchema";
import { getPageSchema } from "~/domains/pageSchemas";
import { type UserData } from "~/domains/userData";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { type StrapiDynamicArray } from "~/services/cms/models/formElements/StrapiDynamicArraySchema";

export type DynamicArrayProps = StrapiDynamicArray & {
  fieldName: string;
  stepData: UserData;
};

export const DynamicArray = (props: DynamicArrayProps) => {
  const {
    name: _name,
    arrayItemLengthVariable,
    dynamicArrayGroup: { formComponents },
    stepData,
    fieldName,
  } = props;
  const { pathname } = useLocation();
  const pageSchema = getPageSchema(pathname);
  const numberOfArrayItems =
    typeof stepData[arrayItemLengthVariable] === "number"
      ? stepData[arrayItemLengthVariable]
      : 0;

  if (!pageSchema) return null;

  const formComponentsToRender = formComponents.filter(
    ({ __component }) => __component !== "form-elements.hidden-input",
  );

  const schema = getNestedSchema(pageSchema[fieldName]) as ZodObject;

  const schemaWithoutRecursion = omit(schema.shape, fieldName);

  return times(numberOfArrayItems, (idx) => (
    <Fragment key={idx}>
      <SchemaComponents
        pageSchema={mapKeys(
          schemaWithoutRecursion,
          (_, key) => `${fieldName}[${idx}]${key}`,
        )}
        formComponents={formComponentsToRender.map((component) => ({
          ...component,
          name: resolveArrayCharacter(component.name, [idx]),
        }))}
      />
    </Fragment>
  ));
};
