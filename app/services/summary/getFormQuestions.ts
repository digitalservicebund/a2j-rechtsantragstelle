import type { FlowId } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { fetchFlowPage } from "~/services/cms/index.server";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import {
  fetchAllFormFields,
  type FormFieldsMap,
} from "~/services/cms/fetchAllFormFields";

export type FieldOption = {
  text: string;
  value: string;
};

export type FieldQuestion = {
  question: string; // The actual question text
  options?: FieldOption[]; // Available answer options (for select/dropdown/tile-group)
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
  const fieldQuestions: Record<string, FieldQuestion> = {};
  const stepPagesCache: Record<string, StrapiFormFlowPage> = {};

  const flow = flows[flowId];
  if (!flow) {
    throw new Error(`Unknown flowId: ${flowId}`);
  }

  if (flow.flowType !== "formFlow") {
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
        }
      }

      if (!stepId) {
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

        let formComponent = formPage.form.find(
          (component) => "name" in component && component.name === fieldName,
        );

        if (!formComponent) {
          const availableComponents = formPage.form
            .filter((comp) => "name" in comp)
            .map((comp) => ({
              name: (comp as any).name,
              type: comp.__component,
              hasOptions: "options" in comp,
              optionCount:
                "options" in comp ? (comp as any).options?.length : 0,
            }));
        }

        // If direct match not found, look for a parent fieldset or component with nested fields
        if (!formComponent) {
          console.log(
            `🔍 Looking for parent fieldset containing "${fieldName}.*" components`,
          );

          // Look for components that have fieldName as a prefix (e.g., "besondereBelastungen" in "besondereBelastungen.pregnancy")
          formComponent = formPage.form.find((component) => {
            if (
              "components" in component &&
              component.components &&
              Array.isArray(component.components)
            ) {
              // Check if any nested component has our fieldName as a prefix
              const hasNestedFields = component.components.some(
                (nestedComp: any) =>
                  nestedComp &&
                  "name" in nestedComp &&
                  nestedComp.name?.startsWith(`${fieldName}.`),
              );

              return hasNestedFields;
            }
            return false;
          });

          // If no parent fieldset found, check if we have direct components with this prefix
          if (!formComponent) {
            const hasDirectNestedComponents = formPage.form.some(
              (component) =>
                "name" in component &&
                (component as any).name?.startsWith(`${fieldName}.`),
            );

            if (hasDirectNestedComponents) {
              // Extract options from the nested components
              const nestedComponents = formPage.form.filter(
                (component) =>
                  "name" in component &&
                  (component as any).name?.startsWith(`${fieldName}.`),
              );

              const options: FieldOption[] = [];
              nestedComponents.forEach((comp: any) => {
                if (comp.name && comp.label) {
                  // Extract the suffix after the dot (e.g., "pregnancy" from "besondereBelastungen.pregnancy")
                  const optionValue = comp.name.split(".").pop();
                  if (optionValue) {
                    options.push({
                      text: comp.label,
                      value: optionValue,
                    });
                  }
                }
              });

              fieldQuestions[fieldName] = {
                question: formPage.heading,
                ...(options.length > 0 && { options }),
              };

              // Skip the normal component processing since we handled it directly
              continue;
            }
          }
        }

        if (formComponent) {
          // Extract options directly if they exist
          let options: FieldOption[] | undefined;
          if (
            "options" in formComponent &&
            Array.isArray(formComponent.options)
          ) {
            // Handle different option structures
            if (formComponent.__component === "form-elements.tile-group") {
              // Tile group uses {title, value} - convert to {text, value}
              options = formComponent.options.map((opt: any) => ({
                text: opt.title || opt.value,
                value: opt.value,
              }));
            } else {
              // Select/dropdown use {text, value} - use directly
              options = formComponent.options as FieldOption[];
            }
          }

          // Handle components with labels
          if ("label" in formComponent && formComponent.label) {
            const fieldQuestion = {
              question: formComponent.label,
              ...(options && { options }),
            };

            fieldQuestions[fieldName] = fieldQuestion;
          }
          // Handle components without labels (like radio buttons) but with options
          else if (options && options.length > 0) {
            const fieldQuestion = {
              question: formPage.heading, // Use page heading as question
              options: options,
            };

            fieldQuestions[fieldName] = fieldQuestion;
          }
        }

        // Only fall back to page heading if no component was found
        if (!formComponent && formPage.heading) {
          // If no specific field label, use the page heading as the question
          fieldQuestions[fieldName] = {
            question: formPage.heading,
          };
        }
      } catch (error) {
        console.warn(
          `Failed to fetch form page for field ${fieldName} on step ${stepId}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error(`❌ Error in getFormQuestionsForFields:`, error);
    return {};
  }

  return fieldQuestions;
}
