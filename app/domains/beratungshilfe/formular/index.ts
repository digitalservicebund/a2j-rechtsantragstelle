import { getRechtsproblemStrings } from "~/domains/beratungshilfe/formular/rechtsproblem/stringReplacements";
import type { Flow } from "~/domains/flows.server";
import {
  getAmtsgerichtStrings,
  getStaatlicheLeistungenStrings,
  getAnwaltStrings,
  getMissingInformationStrings,
  ausgabenStrings,
  weiteresEinkommenStrings,
  eigentumZusammenfassungShowTotalWorthWarnings,
  getWeitereDokumenteStrings,
} from "./stringReplacements";
import type { BeratungshilfeFormularUserData } from "./userData";
import { beratungshilfeXstateConfig } from "./xstateConfig";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../../shared/formular/stringReplacements";

export const beratungshilfeFormular = {
  flowType: "formFlow",
  config: beratungshilfeXstateConfig,
  guards: {},
  stringReplacements: (context: BeratungshilfeFormularUserData) => ({
    ...getAmtsgerichtStrings(context),
    ...getStaatlicheLeistungenStrings(context),
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...getAnwaltStrings(context),
    ...getRechtsproblemStrings(context),
    ...eigentumZusammenfassungShowPartnerschaftWarnings(context),
    ...eigentumZusammenfassungShowTotalWorthWarnings(context),
    ...getMissingInformationStrings(context),
    ...ausgabenStrings(context),
    ...geldAnlagenStrings(context),
    ...weiteresEinkommenStrings(context),
    ...getWeitereDokumenteStrings(context),
  }),
} satisfies Flow;
