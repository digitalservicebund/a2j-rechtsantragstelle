import _ from "lodash";
import { type BeratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import {
  beratungshilfeAnwaltlicheVertretungGuards,
  anwaltlicheVertretungDone,
} from "./anwaltlicheVertretung/guards";
import {
  type BeratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungenGuards,
  grundvoraussetzungDone,
} from "./grundvoraussetzung/context";
import beratungshilfeAnwaltlicheVertretungFlow from "./anwaltlicheVertretung/flow.json";
import beratungshilfeGrundvoraussetzungenFlow from "./grundvoraussetzung/flow.json";
import beratungshilfeFormularFlow from "./flow.json";
import rechtsproblemFlow from "./rechtsproblem/flow.json";
import {
  type BeratungshilfeRechtsproblem,
  rechtsproblemDone,
} from "./rechtsproblem/context";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import abgabeFlow from "./abgabe/flow.json";
import { type BeratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import {
  beratungshilfeFinanzielleAngabeDone,
  beratungshilfeFinanzielleAngabenSubflowState,
} from "./finanzielleAngaben/navStates";
import {
  type BeratungshilfePersoenlicheDaten,
  beratungshilfePersoenlicheDatenDone,
} from "./persoenlicheDaten/context";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import type { BeratungshilfeAbgabe } from "~/models/flows/beratungshilfeFormular/abgabe/context";
import {
  getKinderStrings,
  getArrayIndexStrings,
  getAmtsgerichtStrings,
  getStaatlicheLeistungenStrings,
  getAnwaltStrings,
  eigentumZusammenfassungShowWarnings,
} from "./stringReplacements";
import { finanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";

export const beratungshilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(beratungshilfeFormularFlow, {
    meta: { arrays: finanzielleAngabenArrayConfig },
    states: {
      grundvoraussetzungen: _.merge(beratungshilfeGrundvoraussetzungenFlow, {
        meta: { done: grundvoraussetzungDone },
      }),
      anwaltlicheVertretung: _.merge(beratungshilfeAnwaltlicheVertretungFlow, {
        meta: { done: anwaltlicheVertretungDone },
      }),
      rechtsproblem: _.merge(rechtsproblemFlow, {
        meta: { done: rechtsproblemDone },
      }),
      finanzielleAngaben: _.merge(finanzielleAngabenFlow, {
        meta: {
          done: beratungshilfeFinanzielleAngabeDone,
          subflowState: beratungshilfeFinanzielleAngabenSubflowState,
        },
      }),
      persoenlicheDaten: _.merge(persoenlicheDatenFlow, {
        meta: { done: beratungshilfePersoenlicheDatenDone },
      }),
      abgabe: abgabeFlow,
    },
  }),
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
    ...eigentumZusammenfassungShowWarnings(context),
  }),
} as const;

export type BeratungshilfeFormularContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeAnwaltlicheVertretung &
  BeratungshilfeRechtsproblem &
  BeratungshilfeFinanzielleAngaben &
  BeratungshilfePersoenlicheDaten &
  BeratungshilfeAbgabe;
