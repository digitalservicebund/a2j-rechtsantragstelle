import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import type { StepComponentWithSchema } from "~/components/form/steps";
import { z } from "zod";

export function yesNoStep(inputName: string): StepComponentWithSchema {
  const schema = z.object({ [inputName]: YesNoAnswer });
  return {
    schema,
  };
}

export function moneyInputStep(inputName: string) {
  return {
    schema: z.object({
      [inputName]: buildMoneyValidationSchema({ min: 0 }),
    }),
  };
}
