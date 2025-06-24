import {
  famFG,
  geringesEinkommen,
  minderjaehrig,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

export const getVereinfachteErklaerungStrings = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    kindName: `${context.child?.vorname ?? ""} ${context.child?.nachname ?? ""}`,
    minderjaehrig: minderjaehrig({ context }),
    famFG: famFG({ context }),
    hohesEinkommen: !geringesEinkommen({ context }),
  };
};
