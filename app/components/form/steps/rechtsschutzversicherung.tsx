import { z } from "zod";
import { YesNoAnswer, yesNoRadioGroup } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";

const schema = z.object({ hasRechtsschutzversicherung: YesNoAnswer });

export const rechtsschutzversicherungStep = {
  schema,
  component: ({ content }: StepComponentProps) =>
    yesNoRadioGroup(content, schema),
};
