import { z } from "zod";
import type { GenericGuard } from "~/flows/guards.server";
import { vornameNachnameSchema } from "~/flows/shared/persoenlicheDaten/context";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const beziehungSchema = z.enum(
  [
    "mutter",
    "vater",
    "grossmutter",
    "grossvater",
    "kind",
    "enkelkind",
    "exEhepartnerin",
    "exEhepartner",
  ],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeAntragstellendePersonContext = {
  empfaenger: z.enum(["ich", "anderePerson"], customRequiredErrorMessage),
  unterhaltsanspruch: z.enum(
    ["keine", "unterhalt", "anspruchNoUnterhalt"],
    customRequiredErrorMessage,
  ),
  unterhaltssumme: buildMoneyValidationSchema(),
  livesPrimarilyFromUnterhalt: YesNoAnswer,
  unterhaltspflichtigePerson: z
    .object({
      beziehung: beziehungSchema,
      ...vornameNachnameSchema,
    })
    .partial(),
  couldLiveFromUnterhalt: YesNoAnswer,
  personWhoCouldPayUnterhaltBeziehung: beziehungSchema,
  whyNoUnterhalt: stringRequiredSchema,
};

export const unterhaltLeisteIch: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonContext
> = ({ context }) => context.empfaenger === "anderePerson";

export const unterhaltBekommeIch: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonContext
> = ({ context }) => context.livesPrimarilyFromUnterhalt === "yes";

export const couldLiveFromUnterhalt: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonContext
> = ({ context }) => context.couldLiveFromUnterhalt === "yes";

const _contextObject = z
  .object(prozesskostenhilfeAntragstellendePersonContext)
  .partial();
export type ProzesskostenhilfeAntragstellendePersonContext = z.infer<
  typeof _contextObject
>;

export const antragstellendePersonDone: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonContext
> = ({ context }) => {
  console.log(context);
  return false;
};
