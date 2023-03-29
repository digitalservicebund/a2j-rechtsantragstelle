import { z } from "zod";
import { RadioGroup } from "~/components";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantOptions } from "~/services/cms/getPageConfig";

export const vermoegenOptions = z.enum(["below_10k", "above_10k"]);
export type VermoegenOptions = z.infer<typeof vermoegenOptions>;
const schema = z.object({ vermoegen: vermoegenOptions });

export const vermoegenStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.vermoegen;
    const options = getRelevantOptions(content, fieldName) ?? [];
    return <RadioGroup name={fieldName} options={options} />;
  },
};
