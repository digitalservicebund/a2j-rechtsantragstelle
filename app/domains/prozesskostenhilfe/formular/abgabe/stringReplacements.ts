import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import {
  unterhaltBekommeIch,
  empfaengerIsAnderePerson,
  empfaengerIsChild,
} from "../antragstellendePerson/guards";
import {
  erstantragAnwalt,
  isErstantrag,
  isNachueberpruefung,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalGericht,
} from "../grundvoraussetzungen/guards";

export const getAbgabeStrings = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    paysOrReceivesUnterhalt:
      unterhaltBekommeIch({ context }) ||
      empfaengerIsAnderePerson({ context }) ||
      empfaengerIsChild({ context }),
    empfaengerIsAnderePerson: empfaengerIsAnderePerson({ context }),
    empfaengerIsChild: empfaengerIsChild({ context }),
    unterhaltBekommeIch: unterhaltBekommeIch({ context }),
    versandAnalog: context.versandArt === "analog",
    erstantragAnwalt: erstantragAnwalt({ context }),
    versandDigitalGericht: versandDigitalGericht({ context }),
    verfahrenAnwalt: verfahrenAnwalt({ context }),
    verfahrenSelbststaendig: verfahrenSelbststaendig({ context }),
    erstantrag: isErstantrag({ context }),
    nachueberpruefung: isNachueberpruefung({ context }),
  };
};

export const getWeitereDokumenteStrings = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    hasWeitereDokumente: context.weitereDokumenteBeweis !== undefined,
  };
};
