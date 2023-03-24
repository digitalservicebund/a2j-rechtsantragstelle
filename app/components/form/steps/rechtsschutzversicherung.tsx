import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer, defaultYesNoOptions } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantOptions } from "~/services/cms/getPageConfig";

const schema = z.object({ hasRechtsschutzversicherung: YesNoAnswer });
const varName = schema.keyof().Values.hasRechtsschutzversicherung;

export const rechtsschutzversicherungStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const options = getRelevantOptions(content, varName) ?? defaultYesNoOptions;
    return <RadioGroup name={varName} options={options} />;
  },
};
