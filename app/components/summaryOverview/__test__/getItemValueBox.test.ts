import { describe, expect, test } from "vitest";
import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { getItemValueBox } from "../getItemValueBox";

describe("getItemValueBox", () => {
  test("returns translated value if a direct translation exists", () => {
    const translations: Translations = {
      "status.active": "Aktiv",
    };
    const userData: Context = { status: "active" };

    const actual = getItemValueBox(translations, userData, [
      { field: "status" },
    ]);
    expect(actual).toBe("Aktiv");
  });

  test("returns empty value when item value is empty", () => {
    const translations: Translations = {};
    const userData: Context = { status: "" };

    const actual = getItemValueBox(translations, userData, [
      { field: "status" },
    ]);

    expect(actual).toBe("");
  });

  test("returns field.value translation if no direct translation exists", () => {
    const translations: Translations = {
      "status.value": "Default Status",
    };
    const userData: Context = { status: "unknown" };

    const actual = getItemValueBox(translations, userData, [
      { field: "status" },
    ]);

    expect(actual).toBe("Default Status");
  });

  test("returns the original item value if no translations exist", () => {
    const translations: Translations = {};
    const userData: Context = { status: "pending" };

    const actual = getItemValueBox(translations, userData, [
      { field: "status" },
    ]);

    expect(actual).toBe("pending");
  });

  test("returns the original item value when translation.value is not available", () => {
    const translations: Translations = {};
    const userData: Context = { status: "approved" };

    const actual = getItemValueBox(translations, userData, [
      { field: "status" },
    ]);

    expect(actual).toBe("approved");
  });

  test("returns value when it is nested in an object", () => {
    const translations: Translations = {};
    const userData: Context = { status: { approved: "true" } };

    const actual = getItemValueBox(translations, userData, [
      { field: "status.approved" },
    ]);

    expect(actual).toBe("true");
  });

  test("returns empty value when it does not exist in the object", () => {
    const translations: Translations = {};
    const userData: Context = { status: { approved: "true" } };

    const actual = getItemValueBox(translations, userData, [
      { field: "status.fail" },
    ]);

    expect(actual).toBe("");
  });

  test("returns concatenated values for multiple fields", () => {
    const translations: Translations = {};
    const userData: Context = { status: "active", role: "admin" };

    const actual = getItemValueBox(translations, userData, [
      { field: "status" },
      { field: "role" },
    ]);

    expect(actual).toBe("active admin");
  });

  test("returns emptyValuePlaceholder when item value is empty and placeholder is provided", () => {
    const translations: Translations = {};
    const userData: Context = { status: "" };

    const actual = getItemValueBox(translations, userData, [
      { field: "status", emptyValuePlaceholder: "No Status" },
    ]);

    expect(actual).toBe("No Status");
  });

  test("returns emptyValuePlaceholder when nested item value is empty and placeholder is provided", () => {
    const translations: Translations = {};
    const userData: Context = { status: { approved: "" } };

    const actual = getItemValueBox(translations, userData, [
      { field: "status.approved", emptyValuePlaceholder: "Not Approved" },
    ]);

    expect(actual).toBe("Not Approved");
  });

  test("returns concatenated values with placeholders for multiple fields", () => {
    const translations: Translations = {};
    const userData: Context = { status: "", role: "admin" };

    const actual = getItemValueBox(translations, userData, [
      { field: "status", emptyValuePlaceholder: "No Status" },
      { field: "role" },
    ]);

    expect(actual).toBe("No Status admin");
  });
});
