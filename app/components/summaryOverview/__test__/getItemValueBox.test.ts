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

    const actual = getItemValueBox(translations, userData, "status");
    expect(actual).toBe("Aktiv");
  });

  test("returns empty value when item value is empty", () => {
    const translations: Translations = {};
    const userData: Context = { status: "" };

    const actual = getItemValueBox(
      translations,
      userData,
      "status",
      "Keine Angabe",
    );

    expect(actual).toBe("Keine Angabe");
  });

  test("returns field.value translation if no direct translation exists", () => {
    const translations: Translations = {
      "status.value": "Default Status",
    };
    const userData: Context = { status: "unknown" };

    const actual = getItemValueBox(translations, userData, "status");

    expect(actual).toBe("Default Status");
  });

  test("returns the original item value if no translations exist", () => {
    const translations: Translations = {};
    const userData: Context = { status: "pending" };

    const actual = getItemValueBox(translations, userData, "status");

    expect(actual).toBe("pending");
  });

  test("returns the original item value when translation.value is not available", () => {
    const translations: Translations = {};
    const userData: Context = { status: "approved" };

    const actual = getItemValueBox(translations, userData, "status");

    expect(actual).toBe("approved");
  });
});
