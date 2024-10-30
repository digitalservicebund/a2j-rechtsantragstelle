import { antragstellendePersonDone } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/context";
import { einkuenfteDone } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/doneFunctions";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  ausgabenZusammenfassungDone,
  eigentumZusammenfassungDone,
  kinderDone,
  partnerDone,
} from "./finanzielleAngaben/doneFunctions";
import { eigentumDone } from "./finanzielleAngaben/eigentumDone";
import type { ProzesskostenhilfeFormularContext } from "./index";
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