import { z } from "zod";
import { RadioGroup } from "~/components";
import { defaultYesNoOptions, YesNoAnswer } from "../answers";
import { getRelevantOptions } from "~/services/cms/getPageConfig";
import type { StepComponentProps } from "~/components/form/steps";

const schema = z.object({ isHamburgOderBremen: YesNoAnswer });

export const hamburgOderBremenStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.isHamburgOderBremen;
    const options =
      getRelevantOptions(content, fieldName) ?? defaultYesNoOptions;
    return <RadioGroup name={fieldName} options={options} />;
  },
};
