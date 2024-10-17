import type { FlowId } from "~/flows/flowIds";
import { getStrapiEntry } from "./getStrapiEntry";

export type FormFieldsMap = Record<string, string[]>;

const getApiIdByFlowId = (
  flowId: FlowId,
): "form-flow-pages" | "vorab-check-pages" => {
  switch (flowId) {
    case "/beratungshilfe/vorabcheck":
    case "/fluggastrechte/vorabcheck":
    case "/geld-einklagen/vorabcheck":
      return "vorab-check-pages";
    default:
      return "form-flow-pages";
  }
};

export async function fetchAllFormFields(
  flowId: FlowId,
): Promise<FormFieldsMap> {
  const apiId = getApiIdByFlowId(flowId);
  const filters = [{ field: "flow_ids", nestedField: "flowId", value: flowId }];
  const populate = "form";
  const strapiEntries = await getStrapiEntry({ apiId, filters, populate });

  return Object.fromEntries(
    strapiEntries
      .filter((formFlowPage) => formFlowPage !== null)
      .filter(({ attributes: { stepId, form } }) => form.length > 0 && stepId)
      .map(({ attributes: { stepId, form } }) => [
        stepId,
        form.map((formField) => formField.name),
      ]),
  );
}
