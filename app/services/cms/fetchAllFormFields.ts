import type { FlowId } from "~/flows/flowIds";
import { getFieldsByFormElements } from "./getFieldsByFormElements";
import { getStrapiEntry } from "./getStrapiEntry";

export type FormFieldsMap = Record<string, string[]>;

export async function fetchAllFormFields(
  flowId: FlowId,
): Promise<FormFieldsMap> {
  const apiId = "form-flow-pages";
  const filters = [{ field: "flow_ids", nestedField: "flowId", value: flowId }];
  const populate = "populate[form][populate][fieldsetGroup][populate]=*";
  const strapiEntries = await getStrapiEntry({ apiId, filters, populate });

  return Object.fromEntries(
    strapiEntries
      .filter((formFlowPage) => formFlowPage !== null)
      .filter(({ attributes: { stepId, form } }) => form.length > 0 && stepId)
      .map(({ attributes: { stepId, form } }) => [
        stepId,
        getFieldsByFormElements(form),
      ]),
  );
}
