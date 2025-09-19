import type { GenericGuard } from "~/domains/guards.server";
import { vereinfachteErklaerungDone } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { ProzesskostenhilfeAntragstellendePersonUserData } from "./userData";

type AntragsstellendePersonGuard =
  GenericGuard<ProzesskostenhilfeAntragstellendePersonUserData>;

export const empfaengerIsAnderePerson: AntragsstellendePersonGuard = ({
  context,
}) => context.empfaenger === "otherPerson";

export const empfaengerIsChild: AntragsstellendePersonGuard = ({ context }) =>
  context.empfaenger === "child";

export const unterhaltBekommeIch: AntragsstellendePersonGuard = ({ context }) =>
  context.livesPrimarilyFromUnterhalt === "yes";

export const couldLiveFromUnterhalt: AntragsstellendePersonGuard = ({
  context,
}) => context.couldLiveFromUnterhalt === "yes";

const unterhaltsAnspruchDone: AntragsstellendePersonGuard = ({ context }) =>
  context.unterhaltsanspruch === "keine" ||
  (context.unterhaltsanspruch === "sonstiges" &&
    context.unterhaltsbeschreibung !== undefined) ||
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

export const antragstellendePersonDone: AntragsstellendePersonGuard = ({
  context,
}) =>
  empfaengerIsAnderePerson({ context }) ||
  (unterhaltsAnspruchDone({ context }) &&
    (context.empfaenger === "myself" ||
      (empfaengerIsChild({ context }) &&
        vereinfachteErklaerungDone({ context }))));
