import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
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
  // TODO: replace "false" with actual values once Antragstellende Person is complete
  return {
    paysOrReceivesUnterhalt: false,
    unterhaltLeisteIch: false,
    unterhaltBekommeIch: false,
    versandAnalog: context.versandArt === "analog",
    versandDigitalAnwalt: versandDigitalAnwalt({ context }),
    versandDigitalGericht: versandDigitalGericht({ context }),
    verfahrenAnwalt: verfahrenAnwalt({ context }),
    verfahrenSelbststaendig: verfahrenSelbststaendig({ context }),
    erstantrag: erstantrag({ context }),
    nachueberpruefung: nachueberpruefung({ context }),
  };
};
