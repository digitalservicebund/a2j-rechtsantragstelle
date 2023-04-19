import { z } from "zod";
import { YesNoAnswer, yesNoOptions } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";
import RadioGroup from "~/components/RadioGroup";
import Heading from "~/components/Heading";
import { freibetrag } from "~/lib/freibetrag";

const schema = z.object({ excessiveDisposableIncome: YesNoAnswer });
const fieldname = schema.keyof()._def.values[0] as string;

export const verfuegbaresEinkommenStep = {
  schema,
  additionalContext: ["kidsTotal", "isErwerbstaetig", "partnerschaft"], // could also import kinderAnzahlSchema.keyof().Values.kidsTotal,
  component: ({ content, additionalContext = {} }: StepComponentProps) => {
    // Destructure variables that were hopefully passed in via the additionalContext. Note: This will currently fail silently
    const { kidsTotal, isErwerbstaetig, partnerschaft } = additionalContext;

    const isWorking = isErwerbstaetig == YesNoAnswer.Enum.yes;
    const isInPartnership = partnerschaft == YesNoAnswer.Enum.yes;
    const kidsCountTotal = parseFloat(kidsTotal);
    const freiBetrag = freibetrag(isWorking, isInPartnership, kidsCountTotal);

    return (
      <>
        <Heading
          level={2}
          text={`Liegen sie monatlich nach Abzug aller Ausgaben über dem Freibetrag von ${freiBetrag} €?`}
        />
        <RadioGroup
          name={fieldname}
          options={yesNoOptions(content, fieldname)}
        />
      </>
    );
  },
};
