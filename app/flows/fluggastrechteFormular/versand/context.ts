import { z } from "zod";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addDays, addYears, today } from "~/util/date";

export const fluggastrechtVersandDaten = {
  frist: createDateSchema({
    earliest: () => addYears(today(), -3),
    latest: () => addDays(today(), -1),
  }),
  versaeumnisurteil: YesNoAnswer,
  anmerkung: stringOptionalSchema,
  aenderungMitteilung: checkedRequired,
};

const _contextObject = z.object(fluggastrechtVersandDaten).partial();
export type FluggastrechtVersandContext = z.infer<typeof _contextObject>;
