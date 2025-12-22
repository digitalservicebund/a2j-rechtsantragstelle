import type { FlowId } from "~/domains/flowIds";
import { fetchFlowPage } from "~/services/cms/index.server";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { parseArrayField } from "./fieldParsingUtils";
import type { FieldOption, FieldQuestion } from "./types";
import { type FormFieldsMap } from "~/domains/pageSchemas";

/**
 * Creates a mapping of field names to their step IDs from the form fields map
 */
export function createFieldToStepMapping(
  formFieldsMap: FormFieldsMap,
  flowId?: FlowId,
): Record<string, string> {
  const mapping: Record<string, string> = {};

  for (const [stepId, fieldNames] of Object.entries(formFieldsMap)) {
    // Prepend flowId to create full absolute path
    const fullStepId = flowId ? `${flowId}${stepId}` : stepId;
    for (const fieldName of fieldNames) {
      mapping[fieldName] = fullStepId;
    }
  }

  return mapping;
}

export function findStepIdForField(
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

  // Handle array fields like "kinder[0]" -> look for "kinder#" mappings
  const fieldInfo = parseArrayField(fieldName);
  if (!stepId && fieldInfo.isArrayField && !fieldInfo.isArraySubField) {
    const arrayFieldMapping = Object.entries(fieldToStepMapping).find(
      ([mappedField]) =>
        mappedField.includes("#") &&
        mappedField.startsWith(`${fieldInfo.baseFieldName}#`),
    );
    if (arrayFieldMapping) {
      stepId = arrayFieldMapping[1];
    }
  }

  // Handle array sub-fields like "kinder[0].vorname" -> look for "kinder#vorname" mappings
  if (!stepId && fieldInfo.isArraySubField && fieldInfo.subFieldName) {
    const arrayFieldKey = `${fieldInfo.baseFieldName}#${fieldInfo.subFieldName}`;
    stepId = fieldToStepMapping[arrayFieldKey];
  }

  return stepId;
}

export function extractOptionsFromComponent(
  formComponent: StrapiFormComponent,
): FieldOption[] | undefined {
  if (!("options" in formComponent) || !Array.isArray(formComponent.options)) {
    return undefined;
  }

  if (formComponent.__component === "form-elements.tile-group") {
    // Tile group uses {title, value} - convert to {text, value}
    return formComponent.options.map(
      (opt: { title: string; value: string }) => ({
        text: (opt as { title: string; value: string }).title ?? opt.value,
        value: opt.value,
      }),
    );
  } else {
    // Select/dropdown use {text, value} - use directly
    return formComponent.options as FieldOption[];
  }
}

export function createFieldQuestionFromComponent(
  formComponent: StrapiFormComponent,
  formPage: StrapiFormFlowPage,
): FieldQuestion {
  const options = extractOptionsFromComponent(formComponent);

  // Handle components with labels
  if ("label" in formComponent && formComponent.label) {
    const result = {
      question: formComponent.label,
      ...(options && { options }),
    };
    return result;
  }
  // Handle components without labels (like radio buttons) but with options
  else if (options && options.length > 0) {
    const result = {
      question: formPage.heading, // Use page heading as question
      options: options,
    };
    return result;
  }

  // Fallback to page heading
  const result = {
    question: formPage.heading,
  };

  return result;
}

export function processNestedComponents(
  fieldName: string,
  formPage: StrapiFormFlowPage,
): FieldQuestion | null {
  const hasDirectNestedComponents = formPage.form.some(
    (component: StrapiFormComponent) =>
      "name" in component && component.name?.startsWith(`${fieldName}.`),
  );

  if (!hasDirectNestedComponents) {
    return null;
  }

  // Extract options from the nested components
  const nestedComponents = formPage.form.filter(
    (component: StrapiFormComponent) =>
      "name" in component && component.name?.startsWith(`${fieldName}.`),
  );

  const options: FieldOption[] = [];
  for (const comp of nestedComponents) {
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
  }

  const result = {
    question: formPage.heading,
    ...(options.length > 0 && { options }),
  };
  return result;
}

function findParentFieldset(
  fieldName: string,
  formPage: StrapiFormFlowPage,
): StrapiFormComponent | null {
  return (
    formPage.form.find((component: StrapiFormComponent) => {
      if (
        "components" in component &&
        component.components &&
        Array.isArray(component.components)
      ) {
        // Check if any nested component has our fieldName as a prefix
        return component.components.some(
          (nestedComp: StrapiFormComponent) =>
            nestedComp &&
            "name" in nestedComp &&
            nestedComp.name?.startsWith(`${fieldName}.`),
        );
      }
      return false;
    }) ?? null
  );
}

export async function processFieldForQuestions(
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

  // For array fields, convert "kinder[0].wohnortBeiAntragsteller" to "kinder#wohnortBeiAntragsteller"
  let componentLookupName = fieldName;

  const fieldInfo = parseArrayField(fieldName);
  if (fieldInfo.isArraySubField && fieldInfo.subFieldName) {
    componentLookupName = `${fieldInfo.baseFieldName}#${fieldInfo.subFieldName}`;
  }

  let formComponent: StrapiFormComponent | undefined | null =
    formPage.form.find(
      (component: StrapiFormComponent) =>
        "name" in component && component.name === componentLookupName,
    );

  // If direct match not found, look for a parent component with nested fields
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

  return null;
}

/**
 * Retrieves the original questions for form fields by fetching their form pages
 */
export async function getFormQuestionsForFields(
  fieldNames: string[],
  fieldToStepMapping: Record<string, string>,
  flowId: FlowId,
): Promise<Record<string, FieldQuestion>> {
  const stepPagesCache: Record<string, StrapiFormFlowPage> = {};

  const fieldQuestions = await Promise.all(
    fieldNames.map(async (fieldName) => {
      const fieldQuestion = await processFieldForQuestions(
        fieldName,
        fieldToStepMapping,
        stepPagesCache,
        flowId,
      );
      return fieldQuestion ? [fieldName, fieldQuestion] : null;
    }),
  ).then((results) =>
    Object.fromEntries(results.filter((result) => result !== null)),
  );

  return fieldQuestions;
}
