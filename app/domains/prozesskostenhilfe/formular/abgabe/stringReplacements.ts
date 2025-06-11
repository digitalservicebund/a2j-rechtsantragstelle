import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import {
  unterhaltBekommeIch,
  empfaengerIsAnderePerson,
} from "../antragstellendePerson/guards";
import {
  isErstantrag,
  isNachueberpruefung,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "../grundvoraussetzungen/guards";

export const getAbgabeStrings = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    paysOrReceivesUnterhalt:
      unterhaltBekommeIch({ context }) || empfaengerIsAnderePerson({ context }),
    empfaengerIsAnderePerson: empfaengerIsAnderePerson({ context }),
    unterhaltBekommeIch: unterhaltBekommeIch({ context }),
    versandAnalog: context.versandArt === "analog",
    versandDigitalAnwalt: versandDigitalAnwalt({ context }),
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
    hasWeitereDokumente: context.weitereDokumenteBeweis !== null,
  };
};
