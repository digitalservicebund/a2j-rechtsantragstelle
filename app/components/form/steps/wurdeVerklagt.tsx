import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer, defaultYesNoOptions } from "../answers";
import type { StepComponentProps } from "../steps";
import { getRelevantOptions } from "~/services/cms/getPageConfig";

const schema = z.object({ wurdeVerklagt: YesNoAnswer });
const varName = schema.keyof().Values.wurdeVerklagt;

export const wurdeVerklagtStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const options = getRelevantOptions(content, varName) ?? defaultYesNoOptions;
    return <RadioGroup name={varName} options={options} />;
  },
};
