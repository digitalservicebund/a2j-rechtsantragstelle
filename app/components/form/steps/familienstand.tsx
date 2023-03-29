import { z } from "zod";
import { RadioGroup } from "~/components";
import { defaultYesNoOptions, YesNoAnswer } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantOptions } from "~/services/cms/getPageConfig";

const schema = z.object({ partnerschaft: YesNoAnswer });

export const familienstandStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.partnerschaft;
    const options =
      getRelevantOptions(content, fieldName) ?? defaultYesNoOptions;
    return <RadioGroup name={fieldName} options={options} />;
  },
};
