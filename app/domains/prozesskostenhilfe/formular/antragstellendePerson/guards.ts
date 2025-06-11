import type { GenericGuard } from "~/domains/guards.server";
import { vereinfachteErklaerungDone } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { ProzesskostenhilfeAntragstellendePersonUserData } from "./userData";

export const empfaengerIsAnderePerson: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.empfaenger === "anderePerson";

export const empfaengerIsChild: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.empfaenger === "kind";

export const unterhaltBekommeIch: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.livesPrimarilyFromUnterhalt === "yes";

export const couldLiveFromUnterhalt: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) => context.couldLiveFromUnterhalt === "yes";
export const antragstellendePersonDone: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonUserData
> = ({ context }) =>
  (empfaengerIsChild({ context }) && vereinfachteErklaerungDone({ context })) ||
  empfaengerIsAnderePerson({ context }) ||
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
