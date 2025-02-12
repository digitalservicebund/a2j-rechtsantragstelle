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

    expect(getItemValueBox(translations, userData, "status")).toBe("Aktiv");
  });

  test("returns empty value translation when item value is empty", () => {
    const translations: Translations = {
      "status.emptyValue": "Keine Angabe",
    };
    const userData: Context = { status: "" };

    expect(getItemValueBox(translations, userData, "status")).toBe(
      "Keine Angabe",
    );
  });

  test("returns field.value translation if no direct translation exists", () => {
    const translations: Translations = {
      "status.value": "Default Status",
    };
    const userData: Context = { status: "unknown" };

    expect(getItemValueBox(translations, userData, "status")).toBe(
      "Default Status",
    );
  });

  test("returns the original item value if no translations exist", () => {
    const translations: Translations = {};
    const userData: Context = { status: "pending" };

    expect(getItemValueBox(translations, userData, "status")).toBe("pending");
  });

  test("returns the original item value when translation.value is not available", () => {
    const translations: Translations = {};
    const userData: Context = { status: "approved" };

    expect(getItemValueBox(translations, userData, "status")).toBe("approved");
  });
});
