import _ from "lodash";
import type { FlowId } from "~/flows/flowIds";
import { getStrapiEntry } from "./getStrapiEntry";
import type { StrapiSchemas } from "./schemas";
import { config } from "../env/env.server";

export type FormFieldsMap = Record<string, string[]>;

export async function fetchAllFormFields(
  flowId: FlowId,
  environment: string = config().ENVIRONMENT,
): Promise<FormFieldsMap> {
  const apiId = "form-flow-pages";
  const filters = [{ field: "flow_ids", nestedField: "flowId", value: flowId }];
  const populate = "form";
  const strapiEntries = await getStrapiEntry({
    apiId,
    filters,
    populate,
    locale: "all",
  });

  const nonEmptyEntries = strapiEntries
    .filter((formFlowPage) => formFlowPage !== null)
    .filter(({ attributes: { stepId, form } }) => form.length > 0 && stepId);

  const [staging, result] = _.partition(
    nonEmptyEntries,
    ({ attributes: { locale } }) => locale === "sg",
  ).map(fromStrapiSchemasToFormFields);

  if (environment !== "production") {
    // inject staging flowpages
    _.merge(result, staging);
  }

  return result;
}

function fromStrapiSchemasToFormFields(
  schemas: StrapiSchemas["form-flow-pages"],
): FormFieldsMap {
  return Object.fromEntries(
    schemas.map(({ attributes: { stepId, form } }) => [
      stepId,
      form.map((formField) => formField.name),
    ]),
  );
}
