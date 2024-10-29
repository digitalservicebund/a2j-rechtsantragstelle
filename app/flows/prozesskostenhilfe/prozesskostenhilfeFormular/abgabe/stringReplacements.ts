import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfe/prozesskostenhilfeFormular";
import {
  unterhaltBekommeIch,
  unterhaltLeisteIch,
} from "~/flows/prozesskostenhilfe/prozesskostenhilfeFormular/antragstellendePerson/context";
import {
  erstantrag,
  nachueberpruefung,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "~/flows/prozesskostenhilfe/prozesskostenhilfeFormular/grundvoraussetzungen/context";

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
