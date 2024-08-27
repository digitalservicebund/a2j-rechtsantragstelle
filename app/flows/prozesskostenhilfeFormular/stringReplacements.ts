import type { ProzesskostenhilfeFormularContext } from ".";
import {
  andereUnterhaltszahlungenDone,
  eigentumZusammenfassungDone,
  kinderDone,
  partnerDone,
} from "./finanzielleAngaben/doneFunctions";
import { eigentumDone } from "./finanzielleAngaben/guards";

export const getMissingInformationStrings = (
  context: ProzesskostenhilfeFormularContext,
) => {
  return {
    partnerMissingInformation: !partnerDone({ context }),
    kinderMissingInformation: !kinderDone({ context }),
    andereUnterhaltszahlungenMissingInformation: !andereUnterhaltszahlungenDone(
      { context },
    ),
    eigentumMissingInformation: !eigentumDone({ context }),
    eigentumZusammenfassungMissingInformation:
      !eigentumZusammenfassungDone({ context }) && eigentumDone({ context }),
  };
};
