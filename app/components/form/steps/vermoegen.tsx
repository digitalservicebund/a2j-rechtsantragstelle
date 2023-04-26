import { z } from "zod";
import type { StepComponentProps } from "~/components/form/steps";
import RadioGroupWithContent from "~/components/RadioGroupWithContent";

export const vermoegenOptions = z.enum(["below_10k", "above_10k"]);
export type VermoegenOptions = z.infer<typeof vermoegenOptions>;
const schema = z.object({ vermoegen: vermoegenOptions });

export const vermoegenStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.vermoegen;
    return <RadioGroupWithContent name={fieldName} content={content} />;
  },
};
