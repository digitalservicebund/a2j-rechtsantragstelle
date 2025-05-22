import { z } from "zod";
import type { GenericGuard } from "~/domains/guards.server";
import { familyRelationshipInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { vornameNachnameSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const prozesskostenhilfeAntragstellendePersonInputSchema = {
  empfaenger: z.enum(["ich", "anderePerson"], customRequiredErrorMessage),
  unterhaltsanspruch: z.enum(
    ["keine", "unterhalt", "anspruchNoUnterhalt"],
    customRequiredErrorMessage,
  ),
  unterhaltsSumme: buildMoneyValidationSchema(),
  livesPrimarilyFromUnterhalt: YesNoAnswer,
  unterhaltspflichtigePerson: z
    .object({
      beziehung: familyRelationshipInputSchema,
      ...vornameNachnameSchema,
    })
    .optional(),
  couldLiveFromUnterhalt: YesNoAnswer,
  personWhoCouldPayUnterhaltBeziehung: familyRelationshipInputSchema,
  whyNoUnterhalt: stringRequiredSchema,
};

export const unterhaltLeisteIch: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.empfaenger === "anderePerson";

export const unterhaltBekommeIch: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.livesPrimarilyFromUnterhalt === "yes";

export const couldLiveFromUnterhalt: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.couldLiveFromUnterhalt === "yes";

const _partialSchema = z
  .object(prozesskostenhilfeAntragstellendePersonInputSchema)
  .partial();
export type ProzesskostenhilfeAntragstellendePersonUserData = z.infer<
  typeof _partialSchema
>;

export const antragstellendePersonDone: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
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
