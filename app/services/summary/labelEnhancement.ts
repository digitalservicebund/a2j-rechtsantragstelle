import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import type { Translations } from "~/services/translations/getTranslationByKey";

// Type guard to check if component has a label property
function hasLabelProperty(
  component: StrapiFormComponent,
): component is StrapiFormComponent & { label?: string } {
  return "label" in component;
}

// Smart field mappings for common German field names
const SMART_FIELD_MAPPINGS: Record<string, string> = {
  vorname: "Vorname",
  nachname: "Nachname",
  geburtsdatum: "Geburtsdatum",
  plz: "PLZ",
  bic: "BIC",
  iban: "IBAN",
  telefonnummer: "Telefonnummer",
  street: "Straße",
  housenumber: "Hausnummer",
  ort: "Ort",
  email: "E-Mail",
  adresse: "Adresse",
  wohnort: "Wohnort",
  telefon: "Telefon",
  handy: "Handy",
  mobilnummer: "Mobilnummer",
  strasse: "Straße",
  hausnummer: "Hausnummer",
  postleitzahl: "Postleitzahl",
  stadt: "Stadt",
  land: "Land",
  beruf: "Beruf",
  einkommen: "Einkommen",
  ausgaben: "Ausgaben",
  familienstand: "Familienstand",
  staatsangehoerigkeit: "Staatsangehörigkeit",
  bankverbindung: "Bankverbindung",
  kontoinhaber: "Kontoinhaber",
  kontonummer: "Kontonummer",
  bankleitzahl: "Bankleitzahl",
  kreditinstitut: "Kreditinstitut",
};

export function getEnhancedFieldLabel(
  fieldName: string,
  component: StrapiFormComponent,
  translations?: Translations,
): string {
  // 1. CMS form component label (highest priority)
  if (hasLabelProperty(component) && component.label?.trim()) {
    return component.label;
  }

  // 2. Field-specific translation (fields.${fieldName})
  if (translations) {
    const fieldTranslationKey = `fields.${fieldName}`;
    if (translations[fieldTranslationKey]) {
      return translations[fieldTranslationKey];
    }

    // 3. Direct translation key
    if (translations[fieldName]) {
      return translations[fieldName];
    }
  }

  // 4. Smart field mappings for German terms
  const lowerFieldName = fieldName.toLowerCase();
  if (SMART_FIELD_MAPPINGS[lowerFieldName]) {
    return SMART_FIELD_MAPPINGS[lowerFieldName];
  }

  // 5. Algorithmic humanization of field names
  return humanizeFieldName(fieldName);
}

export function humanizeFieldName(fieldName: string): string {
  // Convert camelCase, snake_case, and kebab-case to readable German text
  return (
    fieldName
      // Handle camelCase: convert to space-separated
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Handle snake_case and kebab-case: replace with spaces
      .replace(/[_-]/g, " ")
      // Capitalize first letter of each word
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
      // Clean up extra spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function getFieldTranslationWithFallback(
  fieldName: string,
  translations?: Translations,
  fallback?: string,
): string {
  if (translations) {
    // Try field-specific translation first
    const fieldTranslationKey = `fields.${fieldName}`;
    if (translations[fieldTranslationKey]) {
      return translations[fieldTranslationKey];
    }

    // Try direct translation
    if (translations[fieldName]) {
      return translations[fieldName];
    }
  }

  // Use provided fallback or humanized field name
  return fallback ?? humanizeFieldName(fieldName);
}
