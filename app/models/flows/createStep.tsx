import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { z } from "zod";

export function yesNoStep(inputName: string) {
  return { schema: z.object({ [inputName]: YesNoAnswer }) };
}

export function moneyInputStep(inputName: string) {
  return {
    schema: z.object({ [inputName]: buildMoneyValidationSchema({ min: 0 }) }),
  };
}
