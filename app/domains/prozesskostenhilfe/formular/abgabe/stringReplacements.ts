import {
  unterhaltBekommeIch,
  unterhaltLeisteIch,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/userData";
import {
  erstantrag,
  nachueberpruefung,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

export const getAbgabeStrings = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    paysOrReceivesUnterhalt:
      unterhaltBekommeIch({ context }) || unterhaltLeisteIch({ context }),
    unterhaltLeisteIch: unterhaltLeisteIch({ context }),
    unterhaltBekommeIch: unterhaltBekommeIch({ context }),
    versandAnalog: context.versandArt === "analog",
    versandDigitalAnwalt: versandDigitalAnwalt({ context }),
    versandDigitalGericht: versandDigitalGericht({ context }),
    verfahrenAnwalt: verfahrenAnwalt({ context }),
    verfahrenSelbststaendig: verfahrenSelbststaendig({ context }),
    erstantrag: erstantrag({ context }),
    nachueberpruefung: nachueberpruefung({ context }),
  };
};
