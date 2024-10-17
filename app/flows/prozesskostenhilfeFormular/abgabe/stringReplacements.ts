import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import {
  unterhaltBekommeIch,
  unterhaltLeisteIch,
} from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";
import {
  erstantrag,
  nachueberpruefung,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";

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
