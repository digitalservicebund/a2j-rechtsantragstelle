import { z } from "zod";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const kinderArraySchema = z.array(
  z.object({
    vorname: stringRequiredSchema,
    nachname: stringRequiredSchema,
    geburtsdatum: createDateSchema({
      earliest: () => addYears(today(), -24),
      latest: () => today(),
    }),
    wohnortBeiAntragsteller: z.enum(
      ["yes", "no", "partially"],
      customRequiredErrorMessage,
    ),
    eigeneEinnahmen: YesNoAnswer,
    einnahmen: buildMoneyValidationSchema(),
    unterhalt: YesNoAnswer,
    unterhaltsSumme: buildMoneyValidationSchema(),
  }),
);

export const kinderContext = {
  hasKinder: YesNoAnswer,
  kinder: kinderArraySchema,
  pageData: pageDataSchema,
};

const _object = z.object(kinderContext).partial();

export type KinderContext = z.infer<typeof _object>;
