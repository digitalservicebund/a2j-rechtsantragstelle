import { beforeEach, describe, expect, test, vi } from "vitest";
import { getPageSchema } from "~/domains/pageSchemas";
import { hasMoneyValidationSchema, hasNonEmptyLongTextField } from "../helper";
import {
  buildMoneyValidationSchema,
  formatCurrencyZodDescription,
} from "~/services/validation/money/buildMoneyValidationSchema";

vi.mock("~/domains/pageSchemas", () => ({
  getPageSchema: vi.fn(),
}));

const TEST_PATHNAME =
  "/geld-einklagen/formular/klage-erstellen/prozessfuehrung/anwaltskosten";

describe("Summary Overview Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPageSchema).mockReturnValue(undefined);
  });

  test("hasMoneyValidationSchema returns true for schema with metadata", () => {
    vi.mocked(getPageSchema).mockReturnValue({
      anwaltskosten: buildMoneyValidationSchema({
        min: 1,
      }).meta({ description: formatCurrencyZodDescription }),
    });

    const result = hasMoneyValidationSchema(TEST_PATHNAME, [
      { fieldName: "anwaltskosten", fieldValue: "1.000,00" },
    ]);

    expect(result).toBe(true);
  });

  test("hasMoneyValidationSchema returns false for schema without metadata", () => {
    vi.mocked(getPageSchema).mockReturnValue({
      anwaltskosten: buildMoneyValidationSchema({
        min: 1,
      }),
    });

    const result = hasMoneyValidationSchema(TEST_PATHNAME, [
      { fieldName: "anwaltskosten", fieldValue: "1.000,00" },
    ]);

    expect(result).toBe(false);
  });

  test("hasNonEmptyLongTextField returns true for non-empty long text fields", () => {
    const result = hasNonEmptyLongTextField([
      { fieldName: "sachverhaltBegruendung", fieldValue: "Langer Text" },
    ]);

    expect(result).toBe(true);
  });

  test("hasNonEmptyLongTextField returns false for empty long text fields", () => {
    const result = hasNonEmptyLongTextField([
      { fieldName: "sachverhaltBegruendung", fieldValue: "   " },
    ]);

    expect(result).toBe(false);
  });
});
