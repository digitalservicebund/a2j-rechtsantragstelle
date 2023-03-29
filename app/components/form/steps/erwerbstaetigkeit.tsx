import { z } from "zod";
import { RadioGroup } from "~/components";
import { defaultYesNoOptions, YesNoAnswer } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantOptions } from "~/services/cms/getPageConfig";

const schema = z.object({ isErwerbstaetig: YesNoAnswer });

export const erwerbstaetigkeitStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.isErwerbstaetig;
    const options =
      getRelevantOptions(content, fieldName) ?? defaultYesNoOptions;
    return <RadioGroup name={fieldName} options={options} />;
  },
};
