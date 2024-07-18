import _ from "lodash";
import type { BeratungshilfeAbgabe } from "~/flows/beratungshilfeFormular/abgabe/context";
import abgabeFlow from "./abgabe/flow.json";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import { type BeratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import beratungshilfeAnwaltlicheVertretungFlow from "./anwaltlicheVertretung/flow.json";
import {
  beratungshilfeAnwaltlicheVertretungGuards,
  anwaltlicheVertretungDone,
} from "./anwaltlicheVertretung/guards";
import { finanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";
import {
  pruneContext,
  type BeratungshilfeFinanzielleAngaben,
} from "./finanzielleAngaben/context";
import { eigentumZusammenfassungDone } from "./finanzielleAngaben/eigentumZusammenfassungDone";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  einkommenDone,
  kinderDone,
  partnerDone,
  wohnungDone,
} from "./finanzielleAngaben/navStates";
import { eigentumDone } from "./finanzielleAngaben/navStatesEigentum";
import beratungshilfeFormularFlow from "./flow.json";
import {
  type BeratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungenGuards,
  grundvoraussetzungDone,
} from "./grundvoraussetzung/context";
import beratungshilfeGrundvoraussetzungenFlow from "./grundvoraussetzung/flow.json";
import {
  type BeratungshilfePersoenlicheDaten,
  beratungshilfePersoenlicheDatenDone,
} from "./persoenlicheDaten/context";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
import {
  type BeratungshilfeRechtsproblem,
  rechtsproblemDone,
} from "./rechtsproblem/context";
import rechtsproblemFlow from "./rechtsproblem/flow.json";
import {
  getKinderStrings,
  getArrayIndexStrings,
  getAmtsgerichtStrings,
  getStaatlicheLeistungenStrings,
  getAnwaltStrings,
  eigentumZusammenfassungShowWarnings,
  getMissingInformationStrings,
  ausgabenStrings,
  geldAnlagenStrings,
  weiteresEinkommenStrings,
} from "./stringReplacements";

export const beratungshilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(beratungshilfeFormularFlow, {
    meta: { arrays: finanzielleAngabenArrayConfig },
    states: {
      start: { meta: { done: () => true } },
      grundvoraussetzungen: _.merge(beratungshilfeGrundvoraussetzungenFlow, {
        meta: { done: grundvoraussetzungDone },
      }),
      "anwaltliche-vertretung": _.merge(
        beratungshilfeAnwaltlicheVertretungFlow,
        {
          meta: { done: anwaltlicheVertretungDone },
        },
      ),
      rechtsproblem: _.merge(rechtsproblemFlow, {
        meta: { done: rechtsproblemDone },
      }),
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          einkommen: { meta: { done: einkommenDone } },
          partner: { meta: { done: partnerDone } },
          kinder: { meta: { done: kinderDone } },
          "andere-unterhaltszahlungen": {
            meta: { done: andereUnterhaltszahlungenDone },
          },
          eigentum: { meta: { done: eigentumDone } },
          "eigentum-zusammenfassung": {
            meta: { done: eigentumZusammenfassungDone },
          },
          wohnung: { meta: { done: wohnungDone } },
          ausgaben: { meta: { done: ausgabenDone } },
        },
      }),
      "persoenliche-daten": _.merge(persoenlicheDatenFlow, {
        meta: { done: beratungshilfePersoenlicheDatenDone },
      }),
      abgabe: _.merge(abgabeFlow, {
        meta: { done: () => false },
      }),
    },
  }),
  guards: {
    ...beratungshilfeGrundvoraussetzungenGuards,
    ...beratungshilfeAnwaltlicheVertretungGuards,
    ...beratungshilfeAbgabeGuards,
    ...finanzielleAngabeGuards,
  },
  stringReplacements: (userData: BeratungshilfeFormularContext) => {
    const context = pruneContext(userData);
    return {
      ...getAmtsgerichtStrings(context),
      ...getStaatlicheLeistungenStrings(context),
      ...getKinderStrings(context),
      ...getArrayIndexStrings(context),
      ...getAnwaltStrings(context),
      ...eigentumZusammenfassungShowWarnings(context),
      ...getMissingInformationStrings(context),
      ...ausgabenStrings(context),
      ...geldAnlagenStrings(context),
      ...weiteresEinkommenStrings(context),
    };
  },
} as const;

export type BeratungshilfeFormularContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeAnwaltlicheVertretung &
  BeratungshilfeRechtsproblem &
  BeratungshilfeFinanzielleAngaben &
  BeratungshilfePersoenlicheDaten &
  BeratungshilfeAbgabe;
