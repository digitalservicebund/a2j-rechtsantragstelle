import type { ProzesskostenhilfeFormularContext } from ".";
import {
  andereUnterhaltszahlungenDone,
  eigentumDone,
  eigentumZusammenfassungDone,
  kinderDone,
  partnerDone,
} from "./finanzielleAngaben/doneFunctions";

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
