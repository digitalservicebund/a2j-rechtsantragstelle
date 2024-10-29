import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import {
  unterhaltBekommeIch,
  unterhaltLeisteIch,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/context";
import {
  erstantrag,
  nachueberpruefung,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/context";

export const getAbgabeStrings = (
  context: ProzesskostenhilfeFormularContext,
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
