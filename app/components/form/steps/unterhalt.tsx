import { z } from "zod";
import { YesNoAnswer, yesNoRadioGroup } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";

const schema = z.object({ isPayingUnterhalt: YesNoAnswer });

export const unterhaltStep = {
  schema,
  component: ({ content }: StepComponentProps) =>
    yesNoRadioGroup(content, schema),
};
