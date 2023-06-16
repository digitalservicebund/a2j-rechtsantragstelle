import { z } from "zod";
import { YesNoAnswer, yesNoRadioGroup } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";

const schema = z.object({ hasTriedFreeServices: YesNoAnswer });

export const kostenfreieBeratungStep = {
  schema,
  component: ({ content }: StepComponentProps) =>
    yesNoRadioGroup({ content, schema }),
};
