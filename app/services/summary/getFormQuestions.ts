import type { FlowId } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { fetchFlowPage } from "~/services/cms/index.server";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import {
  fetchAllFormFields,
  type FormFieldsMap,
} from "~/services/cms/fetchAllFormFields";

export type FieldQuestion = {
  fieldName: string;
  question: string; // The actual question text
  pageHeading?: string; // The main heading of the page
  stepId: string;
};

/**
 * Creates a mapping of field names to their step IDs from the form fields map
 */
export function createFieldToStepMapping(
  formFieldsMap: FormFieldsMap,
): Record<string, string> {
  const mapping: Record<string, string> = {};

  for (const [stepId, fieldNames] of Object.entries(formFieldsMap)) {
    for (const fieldName of fieldNames) {
      mapping[fieldName] = stepId;
    }
  }

  return mapping;
}

/**
 * Retrieves the original questions for form fields by fetching their form pages
 */
export async function getFormQuestionsForFields(
  fieldNames: string[],
  flowId: FlowId,
): Promise<Record<string, FieldQuestion>> {
  console.log(`🔍 getFormQuestionsForFields called with:`, {
    fieldNames,
    flowId,
  });

  const fieldQuestions: Record<string, FieldQuestion> = {};
  const stepPagesCache: Record<string, StrapiFormFlowPage> = {};

  const flow = flows[flowId];
  if (!flow) {
    throw new Error(`Unknown flowId: ${flowId}`);
  }

  if (flow.flowType !== "formFlow") {
    console.warn(
      `Form questions service only supports formFlow type, got: ${flow.flowType}`,
    );
    return {};
  }

  try {
    const formFieldsMap = await fetchAllFormFields(flowId);
    const fieldToStepMapping = createFieldToStepMapping(formFieldsMap);

    for (const fieldName of fieldNames) {
      let stepId = fieldToStepMapping[fieldName];

      if (!stepId) {
        // Look for nested field patterns like "berufart.selbststaendig" -> "/finanzielle-angaben/einkommen/art"
        const nestedFieldMapping = Object.entries(fieldToStepMapping).find(
          ([mappedField]) => mappedField.startsWith(`${fieldName}.`),
        );

        if (nestedFieldMapping) {
          stepId = nestedFieldMapping[1];
          console.log(
            `🔧 Found nested mapping: "${fieldName}" -> "${stepId}" via "${nestedFieldMapping[0]}"`,
          );
        }
      }

      console.log(`🔧 Processing field "${fieldName}" -> stepId "${stepId}"`);
      if (!stepId) {
        console.log(`⚠️ No stepId found for field "${fieldName}"`);
        continue;
      }

      try {
        // Cache form pages to avoid duplicate fetches
        if (!stepPagesCache[stepId]) {
          stepPagesCache[stepId] = await fetchFlowPage(
            "form-flow-pages",
            flowId,
            stepId,
          );
        }

        const formPage = stepPagesCache[stepId];

        // Find the form component that matches this field
        let formComponent = formPage.form.find(
          (component) => "name" in component && component.name === fieldName,
        );

        // If direct match not found, look for a parent fieldset or component with nested fields
        if (!formComponent) {
          // Look for components that have fieldName as a prefix (e.g., "weitereseinkommen" in "weitereseinkommen.arbeitlosengeld")
          formComponent = formPage.form.find((component) => {
            if ("components" in component && component.components) {
              // Check if any nested component has our fieldName as a prefix
              return component.components.some(
                (nestedComp: { name?: string }) =>
                  "name" in nestedComp &&
                  nestedComp.name?.startsWith(`${fieldName}.`),
              );
            }
            return false;
          });
        }

        if (formComponent && "label" in formComponent && formComponent.label) {
          fieldQuestions[fieldName] = {
            fieldName,
            question: formComponent.label,
            pageHeading: formPage.heading,
            stepId,
          };
        } else if (formPage.heading) {
          // If no specific field label, use the page heading as the question
          fieldQuestions[fieldName] = {
            fieldName,
            question: formPage.heading,
            pageHeading: formPage.heading,
            stepId,
          };
        }
      } catch (error) {
        console.warn(
          `Failed to fetch form page for field ${fieldName} on step ${stepId}:`,
          error,
        );
        // Continue processing other fields
      }
    }
  } catch (error) {
    console.error(`❌ Error in getFormQuestionsForFields:`, error);
    return {};
  }

  return fieldQuestions;
}
