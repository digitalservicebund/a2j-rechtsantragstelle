import type {
  MultipleFieldsValidationBaseSchema,
  MultipleFieldsStepIdValidation,
} from "~/domains/multipleFieldsFlowValidation";
import { getMultipleFieldsValidation } from "~/domains/multipleFieldsFlowValidation";
import { getMultipleFieldsByStepIdValidation } from "../getMultipleFieldsByStepIdValidation";

vi.mock("~/domains/multipleFieldsFlowValidation");

describe("getMultipleFieldsByStepIdValidation", () => {
  it("should return undefined given a mocked getMultipleFieldsValidation as undefined", () => {
    vi.mocked(getMultipleFieldsValidation).mockReturnValue(undefined);

    const actual = getMultipleFieldsByStepIdValidation(
      "/fluggastrechte/formular",
      "/flugdaten/geplanter-flug",
    );

    expect(actual).toBeUndefined();
  });

  it("should return a value given a mocked getMultipleFieldsValidation", () => {
    const mockMultipleFieldsValidation: MultipleFieldsStepIdValidation = {
      "/flugdaten/geplanter-flug": (
        baseSchema: MultipleFieldsValidationBaseSchema,
      ) => {
        return baseSchema.describe("TEST");
      },
    };

    vi.mocked(getMultipleFieldsValidation).mockReturnValue(
      mockMultipleFieldsValidation,
    );

    const actual = getMultipleFieldsByStepIdValidation(
      "/fluggastrechte/formular",
      "/flugdaten/geplanter-flug",
    );

    expect(actual).toEqual(
      mockMultipleFieldsValidation["/flugdaten/geplanter-flug"],
    );
  });

  it("should return undefined given a not exist mocked pathname getMultipleFieldsValidation", () => {
    const mockMultipleFieldsValidation: MultipleFieldsStepIdValidation = {
      "/flugdaten/geplanter-flug": (
        baseSchema: MultipleFieldsValidationBaseSchema,
      ) => {
        return baseSchema.describe("TEST");
      },
    };

    vi.mocked(getMultipleFieldsValidation).mockReturnValue(
      mockMultipleFieldsValidation,
    );

    const actual = getMultipleFieldsByStepIdValidation(
      "/fluggastrechte/formular",
      "/flugdaten/tatsaechlicher-flug",
    );

    expect(actual).toBeUndefined();
  });
});
