import { useField } from "@rvf/react-router";
import { type ZodRecord, type z } from "zod";
import { SchemaComponents } from "~/components/formElements/SchemaComponents";
import { type SchemaObject } from "~/domains/userData";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";

/**
 * Can't unwrap or get the shape of a ZodRecord, so we must use the useField hook to retrieve the key names
 */
export const ZodRecordComponent = ({
  nestedSchema,
  fieldName,
  formComponents,
}: {
  nestedSchema: ZodRecord;
  fieldName: string;
  formComponents?: StrapiFormComponent[];
}) => {
  const field = useField<z.infer<ZodRecord>>(fieldName);
  const recordValue = field.value();
  const innerSchema: SchemaObject = Object.keys(recordValue).reduce(
    (prev, key) => ({
      ...prev,
      [`${fieldName}.${key}`]: nestedSchema.valueType,
    }),
    {},
  );
  return (
    <SchemaComponents
      key={fieldName}
      pageSchema={innerSchema}
      formComponents={formComponents}
      className={"!m-0"}
    />
  );
};

export const isZodRecord = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodRecord => fieldSchema.def.type === "record";
