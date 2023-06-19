import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer, yesNoRadioGroup } from "~/components/form/answers";
import type { StepComponentProps } from "~/components/form/steps";
import { z } from "zod";
import Input from "../Input";
import { getInputProps } from "~/services/props/getInputProps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";

export function yesNoStep(inputName: string) {
  const schema = z.object({ [inputName]: YesNoAnswer });
  return {
    schema,
    component: ({ content }: StepComponentProps) =>
      yesNoRadioGroup({ content, schema }),
  };
}

export function moneyInputStep(inputName: string) {
  return {
    schema: z.object({
      [inputName]: buildMoneyValidationSchema({ min: 0 }),
    }),
    component: ({ content }: StepComponentProps) => {
      return (
        <Input
          {...getInputProps(getRelevantInputContent({ inputName, content }))}
          name={inputName}
        />
      );
    },
  };
}
