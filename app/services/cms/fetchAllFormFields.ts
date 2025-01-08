import merge from "lodash/merge";
import type { FlowId } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { flowPageApiIdFromFlowType } from "~/services/cms/apiFromFlowType";
import { getStrapiEntry } from "./getStrapiEntry";
import type { StrapiSchemas } from "./schemas";
import { config } from "../env/env.server";

export type FormFieldsMap = Record<string, string[]>;

export async function fetchAllFormFields(
  flowId: FlowId,
  environment: string = config().ENVIRONMENT,
): Promise<FormFieldsMap> {
  const args = {
    apiId: flowPageApiIdFromFlowType(flows[flowId].flowType),
    filters: [{ field: "flow_ids", nestedField: "flowId", value: flowId }],
    populate: "form.name",
    fields: "stepId",
    deep: false,
  };

  const formFields = await getStrapiEntry({ ...args, locale: "de" }).then(
    formFieldsFromEntries,
  );

  const formFieldsStaging =
    environment !== "production"
      ? await getStrapiEntry({ ...args, locale: "sg" }).then(
          formFieldsFromEntries,
        )
      : {};

  return merge(formFields, formFieldsStaging);
}

function formFieldsFromEntries(
  entries:
    | StrapiSchemas["form-flow-pages"]
    | StrapiSchemas["vorab-check-pages"]
    | [null],
): FormFieldsMap {
  return Object.fromEntries(
    entries
      .filter((entry) => entry?.stepId && entry?.form.length > 0)
      .map((entry) => [
        entry!.stepId,
        entry!.form.map((formField) => formField.name),
      ]),
  );
}
