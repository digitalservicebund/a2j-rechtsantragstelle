import { z } from "zod";
import type { GenericGuard } from "~/domains/guards.server";
import { familyRelationshipSchema } from "~/domains/shared/finanzielleAngaben/context";
import { vornameNachnameSchema } from "~/domains/shared/persoenlicheDaten/context";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const prozesskostenhilfeAntragstellendePersonContext = {
  empfaenger: z.enum(["ich", "anderePerson"], customRequiredErrorMessage),
  unterhaltsanspruch: z.enum(
    ["keine", "unterhalt", "anspruchNoUnterhalt"],
    customRequiredErrorMessage,
  ),
  unterhaltsSumme: buildMoneyValidationSchema(),
  livesPrimarilyFromUnterhalt: YesNoAnswer,
  unterhaltspflichtigePerson: z
    .object({
      beziehung: familyRelationshipSchema,
      ...vornameNachnameSchema,
    })
    .optional(),
  couldLiveFromUnterhalt: YesNoAnswer,
  personWhoCouldPayUnterhaltBeziehung: familyRelationshipSchema,
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
> = ({ context }) =>
  unterhaltLeisteIch({ context }) ||
  context.unterhaltsanspruch === "keine" ||
  (context.unterhaltsanspruch === "unterhalt" &&
    context.unterhaltsSumme !== undefined &&
    context.livesPrimarilyFromUnterhalt !== undefined &&
    !unterhaltBekommeIch({ context })) ||
  (context.unterhaltsanspruch === "unterhalt" &&
    context.unterhaltsSumme !== undefined &&
    unterhaltBekommeIch({ context }) &&
    objectKeysNonEmpty(context.unterhaltspflichtigePerson, [
      "beziehung",
      "nachname",
      "vorname",
    ])) ||
  (context.unterhaltsanspruch === "anspruchNoUnterhalt" &&
    context.couldLiveFromUnterhalt !== undefined &&
    !couldLiveFromUnterhalt({ context })) ||
  (context.unterhaltsanspruch === "anspruchNoUnterhalt" &&
    couldLiveFromUnterhalt({ context }) &&
    context.personWhoCouldPayUnterhaltBeziehung !== undefined &&
    context.whyNoUnterhalt !== undefined);
