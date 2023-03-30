import { z } from "zod";
import { YesNoAnswer, yesNoRadioGroup } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";

const schema = z.object({ hasHelpedThemselves: YesNoAnswer });

export const eigeninitiativeStep = {
  schema,
  component: ({ content }: StepComponentProps) =>
    yesNoRadioGroup(content, schema),
};
