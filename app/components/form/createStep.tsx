import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import type { StepComponentProps } from "~/components/form/steps";
import { z } from "zod";
import Input from "../Input";
import { getInputProps } from "~/services/props/getInputProps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";
import RadioGroupWithContent from "../RadioGroupWithContent";

export function yesNoStep(inputName: string) {
  const schema = z.object({ [inputName]: YesNoAnswer });
  return {
    schema,
    component: ({ content }: StepComponentProps) => (
      <RadioGroupWithContent
        name={inputName}
        content={content}
        defaultOptions={[
          { value: YesNoAnswer.enum.no, text: "Nein" },
          { value: YesNoAnswer.enum.yes, text: "Ja" },
        ]}
      />
    ),
  };
}

export function moneyInputStep(inputName: string) {
  return {
    schema: z.object({
      [inputName]: buildMoneyValidationSchema({ min: 0 }),
    }),
    component: ({ content, defaultValues }: StepComponentProps) => {
      return (
        <Input
          {...getInputProps(getRelevantInputContent({ inputName, content }))}
          name={inputName}
          defaultValue={defaultValues && defaultValues[inputName]}
        />
      );
    },
  };
}
