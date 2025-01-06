import type {
  MultiFieldsValidationBaseSchema,
  MultiFieldsStepIdValidation,
} from "~/domains/multiFieldsFlowValidation";
import { getMultiFieldsValidation } from "~/domains/multiFieldsFlowValidation";
import { getMultiFieldsByStepIdValidation } from "../getMultiFieldsByStepIdValidation";

vi.mock("~/domains/multiFieldsFlowValidation");

describe("getMultiFieldsByStepIdValidation", () => {
  it("should return undefined given a mocked getMultiFieldsValidation as undefined", () => {
    vi.mocked(getMultiFieldsValidation).mockReturnValue(undefined);

    const actual = getMultiFieldsByStepIdValidation(
      "/fluggastrechte/formular",
      "/flugdaten/geplanter-flug",
    );

    expect(actual).toBeUndefined();
  });

  it("should return a value given a mocked getMultiFieldsValidation", () => {
    const mockMultiFieldsValidation: MultiFieldsStepIdValidation = {
      "/flugdaten/geplanter-flug": (
        baseSchema: MultiFieldsValidationBaseSchema,
      ) => {
        return baseSchema.describe("TEST");
      },
    };

    vi.mocked(getMultiFieldsValidation).mockReturnValue(
      mockMultiFieldsValidation,
    );

    const actual = getMultiFieldsByStepIdValidation(
      "/fluggastrechte/formular",
      "/flugdaten/geplanter-flug",
    );

    expect(actual).toEqual(
      mockMultiFieldsValidation["/flugdaten/geplanter-flug"],
    );
  });

  it("should return undefined given a not exist mocked pathname getMultiFieldsValidation", () => {
    const mockMultiFieldsValidation: MultiFieldsStepIdValidation = {
      "/flugdaten/geplanter-flug": (
        baseSchema: MultiFieldsValidationBaseSchema,
      ) => {
        return baseSchema.describe("TEST");
      },
    };

    vi.mocked(getMultiFieldsValidation).mockReturnValue(
      mockMultiFieldsValidation,
    );

    const actual = getMultiFieldsByStepIdValidation(
      "/fluggastrechte/formular",
      "/flugdaten/tatsaechlicher-flug",
    );

    expect(actual).toBeUndefined();
  });
});
