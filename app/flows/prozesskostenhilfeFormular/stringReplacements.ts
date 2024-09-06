import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import type { ProzesskostenhilfeFormularContext } from ".";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  ausgabenZusammenfassungDone,
  eigentumZusammenfassungDone,
  kinderDone,
  partnerDone,
} from "./finanzielleAngaben/doneFunctions";
import { eigentumDone } from "./finanzielleAngaben/eigentumDone";

export const getMissingInformationStrings = (
  context: ProzesskostenhilfeFormularContext,
) => {
  return {
    einkuenfteMissingInformation: !einkuenfteDone({ context }),
    partnerMissingInformation: !partnerDone({ context }),
    kinderMissingInformation: !kinderDone({ context }),
    andereUnterhaltszahlungenMissingInformation: !andereUnterhaltszahlungenDone(
      { context },
    ),
    eigentumMissingInformation: !eigentumDone({ context }),
    eigentumZusammenfassungMissingInformation:
      !eigentumZusammenfassungDone({ context }) && eigentumDone({ context }),
    ausgabenMissingInformation: !ausgabenDone({ context }),
    ausgabenZusammenfassungMissingInformation: !ausgabenZusammenfassungDone({
      context,
    }),
  };
};
