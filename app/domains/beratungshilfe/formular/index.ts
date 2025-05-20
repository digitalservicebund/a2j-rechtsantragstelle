import { getRechtsproblemStrings } from "~/domains/beratungshilfe/formular/rechtsproblem/stringReplacements";
import type { Flow } from "~/domains/flows.server";
import { type AbgabeUserData } from "~/domains/shared/formular/abgabe/userData";
import { type DokumenteUserData } from "./abgabe/dokumente/userData";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import { beratungshilfeAnwaltlicheVertretungGuards } from "./anwaltlicheVertretung/guards";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "./anwaltlicheVertretung/userData";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { type BeratungshilfeFinanzielleAngabenUserData } from "./finanzielleAngaben/userData";
import { beratungshilfeGrundvoraussetzungenGuards, type BeratungshilfeGrundvoraussetzungenUserData } from "./grundvoraussetzung/userData";
import { type BeratungshilfePersoenlicheDatenUserData } from "./persoenlicheDaten/userData";
import { type BeratungshilfeRechtsproblemUserData } from "./rechtsproblem/userData";
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
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../../shared/formular/stringReplacements";

export const beratungshilfeFormularUserData = {
  flowType: "formFlow",
  config: beratungshilfeXstateConfig,
  guards: {
    ...beratungshilfeGrundvoraussetzungenGuards,
    ...beratungshilfeAnwaltlicheVertretungGuards,
    ...beratungshilfeAbgabeGuards,
    ...finanzielleAngabeGuards,
  },
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

export type BeratungshilfeFormularUserData = BeratungshilfeGrundvoraussetzungenUserData &
  BeratungshilfeAnwaltlicheVertretungUserData &
  BeratungshilfeRechtsproblemUserData &
  BeratungshilfeFinanzielleAngabenUserData &
  BeratungshilfePersoenlicheDatenUserData &
  AbgabeUserData &
  DokumenteUserData;
