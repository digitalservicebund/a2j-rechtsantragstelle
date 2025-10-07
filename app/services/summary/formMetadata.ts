import type { UserData } from "~/domains/userData";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import type { Translations } from "~/services/translations/getTranslationByKey";
import type { FormFieldMetadata } from "./autoGenerateSummary";
import { getEnhancedFieldLabel } from "./labelEnhancement";
import { formatFieldValue, isFieldEmpty } from "./formatFieldValue";

const EXCLUDED_FIELDS = new Set(["pageData", "csrf", "_action"]);

// Type guard to check if component has a name property
function hasNameProperty(
  component: StrapiFormComponent,
): component is StrapiFormComponent & { name: string } {
  return "name" in component && typeof component.name === "string";
}

// Extract all form components including nested ones from fieldsets
function flattenFormComponents(
  components: StrapiFormComponent[],
): StrapiFormComponent[] {
  const flattened: StrapiFormComponent[] = [];

  components.forEach((component) => {
    if (component.__component === "form-elements.fieldset") {
      // Extract nested components from fieldset
      const fieldsetComponent = component;
      if (fieldsetComponent.fieldSetGroup?.formComponents) {
        flattened.push(
          ...flattenFormComponents(
            fieldsetComponent.fieldSetGroup.formComponents,
          ),
        );
      }
    } else {
      flattened.push(component);
    }
  });

  return flattened;
}
