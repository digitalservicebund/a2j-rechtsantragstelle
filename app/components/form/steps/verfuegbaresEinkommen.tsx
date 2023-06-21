import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import type { StepComponentProps } from "~/components/form/steps";
import Heading from "~/components/Heading";
import { freibetragShort } from "~/lib/freibetrag";
import RadioGroupWithContent from "~/components/RadioGroupWithContent";

const schema = z.object({ excessiveDisposableIncome: YesNoAnswer });
const fieldname = schema.keyof()._def.values[0] as string;

export const verfuegbaresEinkommenStep = {
  schema,
  component: ({ content, additionalContext = {} }: StepComponentProps) => {
    // Destructure variables that were hopefully passed in via the additionalContext. Note: This will currently fail silently
    const { kidsTotal, isErwerbstaetig, partnerschaft } = additionalContext;

    const isWorking = isErwerbstaetig == YesNoAnswer.Enum.yes;
    const isInPartnership = partnerschaft == YesNoAnswer.Enum.yes;
    const kidsCountTotal = parseFloat(kidsTotal);
    const freiBetrag = freibetragShort(
      isWorking,
      isInPartnership,
      kidsCountTotal
    );

    return (
      <>
        <Heading tagName="h2" className="pb-20">
          {freiBetrag} €
        </Heading>
        <RadioGroupWithContent name={fieldname} content={content} />
      </>
    );
  },
};
