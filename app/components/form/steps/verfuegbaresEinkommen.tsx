import { z } from "zod";
import { YesNoAnswer, yesNoOptions } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";
import RadioGroup from "~/components/RadioGroup";
import Heading from "~/components/Heading";

const schema = z.object({ excessiveDisposableIncome: YesNoAnswer });
const fieldname = schema.keyof()._def.values[0] as string;

export const verfuegbaresEinkommenStep = {
  schema,
  component: ({ content, additionalContext }: StepComponentProps) => (
    <>
      <Heading
        level={2}
        text={`Freibetrag: ${
          additionalContext && additionalContext["freibetrag"]
        } €`}
      />
      <RadioGroup name={fieldname} options={yesNoOptions(content, fieldname)} />
    </>
  ),
};
