import { empfaengerIsChild } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/guards";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const getAntragstellendePersonStrings = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    unterhaltspflichtigePersonName: `${context.unterhaltspflichtigePerson?.vorname ?? ""} ${context.unterhaltspflichtigePerson?.nachname ?? ""}`,
    childAlreadyEnteredForVereinfachteErklaerung:
      empfaengerIsChild({ context }) &&
      context.livesTogether !== undefined &&
      objectKeysNonEmpty(context.child, [
        "geburtsdatum",
        "vorname",
        "nachname",
      ]),
  };
};
