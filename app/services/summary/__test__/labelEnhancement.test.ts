import { describe, it, expect } from "vitest";
import {
  getEnhancedFieldLabel,
  humanizeFieldName,
  getFieldTranslationWithFallback,
} from "../labelEnhancement";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import type { Translations } from "~/services/translations/getTranslationByKey";

describe("getEnhancedFieldLabel", () => {
  const mockComponent: StrapiFormComponent = {
    __component: "form-elements.input",
    id: 1,
    name: "testField",
    type: "text",
    errorMessages: [],
  } as StrapiFormComponent;

  const mockTranslations: Translations = {
    "fields.testField": "Test Field Translation",
    "testField": "Direct Translation",
    "fields.anotherField": "Another Field Translation",
  };

  it("should return CMS component label when available", () => {
    const componentWithLabel = {
      ...mockComponent,
      label: "CMS Label",
    };

    const result = getEnhancedFieldLabel("testField", componentWithLabel, mockTranslations);
    expect(result).toBe("CMS Label");
  });

  it("should return field-specific translation when no CMS label", () => {
    const result = getEnhancedFieldLabel("testField", mockComponent, mockTranslations);
    expect(result).toBe("Test Field Translation");
  });

  it("should return direct translation when no field-specific translation", () => {
    const result = getEnhancedFieldLabel("testField", mockComponent, {
      testField: "Direct Translation",
    });
    expect(result).toBe("Direct Translation");
  });

  it("should return smart field mapping when no translations", () => {
    const result = getEnhancedFieldLabel("vorname", mockComponent);
    expect(result).toBe("Vorname");
  });

  it("should return humanized field name as fallback", () => {
    const result = getEnhancedFieldLabel("someRandomFieldName", mockComponent);
    expect(result).toBe("Some Random Field Name");
  });

  it("should handle empty or whitespace CMS labels", () => {
    const componentWithEmptyLabel = {
      ...mockComponent,
      label: "   ",
    };

    const result = getEnhancedFieldLabel("testField", componentWithEmptyLabel, mockTranslations);
    expect(result).toBe("Test Field Translation");
  });

  it("should test the priority order", () => {
    const componentWithLabel = {
      ...mockComponent,
      label: "CMS Label",
    };

    const translations = {
      "fields.testField": "Field Translation",
      testField: "Direct Translation",
    };

    // CMS label should win over translations
    const result = getEnhancedFieldLabel("testField", componentWithLabel, translations);
    expect(result).toBe("CMS Label");
  });
});

describe("humanizeFieldName", () => {
  it("should convert camelCase to readable text", () => {
    expect(humanizeFieldName("firstName")).toBe("First Name");
    expect(humanizeFieldName("dateOfBirth")).toBe("Date Of Birth");
    expect(humanizeFieldName("emailAddress")).toBe("Email Address");
  });

  it("should convert snake_case to readable text", () => {
    expect(humanizeFieldName("first_name")).toBe("First Name");
    expect(humanizeFieldName("date_of_birth")).toBe("Date Of Birth");
    expect(humanizeFieldName("email_address")).toBe("Email Address");
  });

  it("should convert kebab-case to readable text", () => {
    expect(humanizeFieldName("first-name")).toBe("First Name");
    expect(humanizeFieldName("date-of-birth")).toBe("Date Of Birth");
    expect(humanizeFieldName("email-address")).toBe("Email Address");
  });

  it("should handle mixed cases", () => {
    expect(humanizeFieldName("firstName_LastName")).toBe("First Name Last Name");
    expect(humanizeFieldName("date-of_Birth")).toBe("Date Of Birth");
  });

  it("should handle single words", () => {
    expect(humanizeFieldName("name")).toBe("Name");
    expect(humanizeFieldName("email")).toBe("Email");
  });

  it("should clean up extra spaces", () => {
    expect(humanizeFieldName("first___name")).toBe("First Name");
    expect(humanizeFieldName("date---of---birth")).toBe("Date Of Birth");
  });

  it("should handle empty and whitespace strings", () => {
    expect(humanizeFieldName("")).toBe("");
    expect(humanizeFieldName("   ")).toBe("");
  });
});

describe("getFieldTranslationWithFallback", () => {
  const mockTranslations: Translations = {
    "fields.testField": "Field Translation",
    "directField": "Direct Translation",
  };

  it("should return field-specific translation when available", () => {
    const result = getFieldTranslationWithFallback("testField", mockTranslations);
    expect(result).toBe("Field Translation");
  });

  it("should return direct translation when no field-specific", () => {
    const result = getFieldTranslationWithFallback("directField", mockTranslations);
    expect(result).toBe("Direct Translation");
  });

  it("should return provided fallback when no translations", () => {
    const result = getFieldTranslationWithFallback("unknownField", mockTranslations, "Custom Fallback");
    expect(result).toBe("Custom Fallback");
  });

  it("should return humanized field name when no translations or fallback", () => {
    const result = getFieldTranslationWithFallback("someFieldName", mockTranslations);
    expect(result).toBe("Some Field Name");
  });

  it("should work without translations object", () => {
    const result = getFieldTranslationWithFallback("testField", undefined, "Fallback");
    expect(result).toBe("Fallback");
  });

  it("should work without translations object and no fallback", () => {
    const result = getFieldTranslationWithFallback("testField");
    expect(result).toBe("Test Field");
  });
});

describe("smart field mappings", () => {
  const mockComponent: StrapiFormComponent = {
    __component: "form-elements.input",
    id: 1,
    name: "testField",
    type: "text",
    errorMessages: [],
  } as StrapiFormComponent;

  it("should return correct German mapping for common fields", () => {
    const testCases = [
      ["vorname", "Vorname"],
      ["nachname", "Nachname"],
      ["geburtsdatum", "Geburtsdatum"],
      ["plz", "PLZ"],
      ["bic", "BIC"],
      ["iban", "IBAN"],
      ["telefonnummer", "Telefonnummer"],
      ["street", "Straße"],
      ["housenumber", "Hausnummer"],
      ["ort", "Ort"],
      ["email", "E-Mail"],
    ];

    testCases.forEach(([fieldName, expectedLabel]) => {
      const result = getEnhancedFieldLabel(fieldName, mockComponent);
      expect(result).toBe(expectedLabel);
    });
  });

  it("should be case-insensitive for smart mappings", () => {
    const result1 = getEnhancedFieldLabel("VORNAME", mockComponent);
    const result2 = getEnhancedFieldLabel("Vorname", mockComponent);
    const result3 = getEnhancedFieldLabel("vorname", mockComponent);

    expect(result1).toBe("Vorname");
    expect(result2).toBe("Vorname");
    expect(result3).toBe("Vorname");
  });
});