import { getRechtsproblemStrings } from "~/domains/beratungshilfe/formular/rechtsproblem/stringReplacements";
import type { Flow } from "~/domains/flows.server";
import { type DokumenteContext } from "./abgabe/dokumente/context";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import type { BeratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import { beratungshilfeAnwaltlicheVertretungGuards } from "./anwaltlicheVertretung/guards";
import type { BeratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import type { BeratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import { beratungshilfeGrundvoraussetzungenGuards } from "./grundvoraussetzung/context";
import type { BeratungshilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import type { BeratungshilfeRechtsproblem } from "./rechtsproblem/context";
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
import { beratungshilfeXstateConfig } from "./xstateConfig";
import type { AbgabeContext } from "../../shared/formular/abgabe/context";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../../shared/formular/stringReplacements";

export const beratungshilfeFormular = {
  flowType: "formFlow",
  config: beratungshilfeXstateConfig,
  guards: {
    ...beratungshilfeGrundvoraussetzungenGuards,
    ...beratungshilfeAnwaltlicheVertretungGuards,
    ...beratungshilfeAbgabeGuards,
    ...finanzielleAngabeGuards,
  },
  stringReplacements: (context: BeratungshilfeFormularContext) => ({
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

export type BeratungshilfeFormularContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeAnwaltlicheVertretung &
  BeratungshilfeRechtsproblem &
  BeratungshilfeFinanzielleAngaben &
  BeratungshilfePersoenlicheDaten &
  AbgabeContext &
  DokumenteContext;
