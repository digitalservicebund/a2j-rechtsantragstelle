import { antragstellendePersonDone } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";
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
import { prozesskostenhilfePersoenlicheDatenDone } from "./persoenlicheDaten/doneFunctions";
import { rechtsschutzversicherungDone } from "./rechtsschutzversicherung/doneFunctions";

export const getMissingInformationStrings = (
  context: ProzesskostenhilfeFormularContext,
) => {
  return {
    antragstellendePersonMissingInformation: antragstellendePersonDone({
      context,
    }),
    rechtsschutzversicherungMissingInformation:
      !rechtsschutzversicherungDone({
        context,
      }) && context.formularArt !== "nachueberpruefung",
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
    persoenlicheDatenMissingInformation:
      !prozesskostenhilfePersoenlicheDatenDone({ context }),
  };
};
