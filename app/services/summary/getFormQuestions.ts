import type { FlowId } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { fetchFlowPage } from "~/services/cms/index.server";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
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

function findStepIdForField(
  fieldName: string,
  fieldToStepMapping: Record<string, string>,
): string | undefined {
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

  return stepId;
}

function extractOptionsFromComponent(
  formComponent: StrapiFormComponent,
): FieldOption[] | undefined {
  if (!("options" in formComponent) || !Array.isArray(formComponent.options)) {
    return undefined;
  }

  if (formComponent.__component === "form-elements.tile-group") {
    // Tile group uses {title, value} - convert to {text, value}
    return formComponent.options.map((opt) => ({
      text: (opt as { title: string; value: string }).title ?? opt.value,
      value: opt.value,
    }));
  } else {
    // Select/dropdown use {text, value} - use directly
    return formComponent.options as FieldOption[];
  }
}

function createFieldQuestionFromComponent(
  formComponent: StrapiFormComponent,
  formPage: StrapiFormFlowPage,
): FieldQuestion {
  const options = extractOptionsFromComponent(formComponent);

  // Handle components with labels
  if ("label" in formComponent && formComponent.label) {
    return {
      question: formComponent.label,
      ...(options && { options }),
    };
  }
  // Handle components without labels (like radio buttons) but with options
  else if (options && options.length > 0) {
    return {
      question: formPage.heading, // Use page heading as question
      options: options,
    };
  }

  // Fallback to page heading
  return {
    question: formPage.heading,
  };
}

function processNestedComponents(
  fieldName: string,
  formPage: StrapiFormFlowPage,
): FieldQuestion | null {
  const hasDirectNestedComponents = formPage.form.some(
    (component) =>
      "name" in component && component.name?.startsWith(`${fieldName}.`),
  );

  if (!hasDirectNestedComponents) {
    return null;
  }

  // Extract options from the nested components
  const nestedComponents = formPage.form.filter(
    (component) =>
      "name" in component && component.name?.startsWith(`${fieldName}.`),
  );

  const options: FieldOption[] = [];
  nestedComponents.forEach((comp) => {
    if ("name" in comp && "label" in comp && comp.name && comp.label) {
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

  return {
    question: formPage.heading,
    ...(options.length > 0 && { options }),
  };
}

function findParentFieldset(
  fieldName: string,
  formPage: StrapiFormFlowPage,
): StrapiFormComponent | null {
  return (
    formPage.form.find((component) => {
      if (
        "components" in component &&
        component.components &&
        Array.isArray(component.components)
      ) {
        // Check if any nested component has our fieldName as a prefix
        return component.components.some(
          (nestedComp) =>
            nestedComp &&
            "name" in nestedComp &&
            nestedComp.name?.startsWith(`${fieldName}.`),
        );
      }
      return false;
    }) ?? null
  );
}

async function processFieldForQuestions(
  fieldName: string,
  fieldToStepMapping: Record<string, string>,
  stepPagesCache: Record<string, StrapiFormFlowPage>,
  flowId: FlowId,
): Promise<FieldQuestion | null> {
  const stepId = findStepIdForField(fieldName, fieldToStepMapping);

  if (!stepId) {
    return null;
  }

  // Cache form pages to avoid duplicate fetches
  if (!stepPagesCache[stepId]) {
    stepPagesCache[stepId] = await fetchFlowPage(
      "form-flow-pages",
      flowId,
      stepId,
    );
  }

  const formPage = stepPagesCache[stepId];

  let formComponent: StrapiFormComponent | undefined | null =
    formPage.form.find(
      (component) => "name" in component && component.name === fieldName,
    );

  // If direct match not found, look for a parent fieldset or component with nested fields
  if (!formComponent) {
    formComponent = findParentFieldset(fieldName, formPage);

    // If no parent fieldset found, check if we have direct components with this prefix
    if (!formComponent) {
      const nestedResult = processNestedComponents(fieldName, formPage);
      if (nestedResult) {
        return nestedResult;
      }
    }
  }

  if (formComponent) {
    return createFieldQuestionFromComponent(formComponent, formPage);
  }

  // Only fall back to page heading if no component was found
  if (formPage.heading) {
    return {
      question: formPage.heading,
    };
  }

  return null;
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

  const formFieldsMap = await fetchAllFormFields(flowId);
  const fieldToStepMapping = createFieldToStepMapping(formFieldsMap);

  for (const fieldName of fieldNames) {
    const fieldQuestion = await processFieldForQuestions(
      fieldName,
      fieldToStepMapping,
      stepPagesCache,
      flowId,
    );

    if (fieldQuestion) {
      fieldQuestions[fieldName] = fieldQuestion;
    }
  }

  return fieldQuestions;
}
