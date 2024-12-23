import type {
  ValidationMultipleFieldsBaseSchema,
  ValidationMultipleFieldsPathName,
} from "~/domains/validationsMultipleFields";
import { getValidationMultipleFields } from "~/domains/validationsMultipleFields";
import { getValidationMultipleFieldsByPathname } from "../getValidationMultipleFieldsByPathName";

vi.mock("~/domains/validationsMultipleFields");

describe("getValidationMultipleFieldsByPathname", () => {
  it("should return undefined given a mocked getValidationMultipleFields as undefined", () => {
    vi.mocked(getValidationMultipleFields).mockReturnValue(undefined);

    const actual = getValidationMultipleFieldsByPathname(
      "/fluggastrechte/formular/flugdaten/geplanter-flug",
    );

    expect(actual).toBeUndefined();
  });

  it("should return a value given a mocked getValidationMultipleFields", () => {
    const mockValidationMultipleFields: ValidationMultipleFieldsPathName = {
      "/flugdaten/geplanter-flug": (
        baseSchema: ValidationMultipleFieldsBaseSchema,
      ) => {
        return baseSchema.describe("TEST");
      },
    };

    vi.mocked(getValidationMultipleFields).mockReturnValue(
      mockValidationMultipleFields,
    );

    const actual = getValidationMultipleFieldsByPathname(
      "/fluggastrechte/formular/flugdaten/geplanter-flug",
    );

    expect(actual).toEqual(
      mockValidationMultipleFields["/flugdaten/geplanter-flug"],
    );
  });

  it("should return undefined given a not exist mocked pathname getValidationMultipleFields", () => {
    const mockValidationMultipleFields: ValidationMultipleFieldsPathName = {
      "/flugdaten/geplanter-flug": (
        baseSchema: ValidationMultipleFieldsBaseSchema,
      ) => {
        return baseSchema.describe("TEST");
      },
    };

    vi.mocked(getValidationMultipleFields).mockReturnValue(
      mockValidationMultipleFields,
    );

    const actual = getValidationMultipleFieldsByPathname(
      "/fluggastrechte/formular/flugdaten/tatsaechlicher-flug",
    );

    expect(actual).toBeUndefined();
  });
});
