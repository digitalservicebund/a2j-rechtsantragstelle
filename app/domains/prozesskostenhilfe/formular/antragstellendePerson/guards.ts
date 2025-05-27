import type { GenericGuard } from "~/domains/guards.server";
import type { ProzesskostenhilfeAntragstellendePersonUserData } from "./userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const unterhaltLeisteIch: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.empfaenger === "anderePerson";

export const unterhaltBekommeIch: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.livesPrimarilyFromUnterhalt === "yes";

export const couldLiveFromUnterhalt: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.couldLiveFromUnterhalt === "yes";
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
