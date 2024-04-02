import _ from "lodash";
import {
  type BeratungshilfeAnwaltlicheVertretung,
  beratungshilfeAnwaltlicheVertretungGuards,
  anwaltlicheVertretungDone,
} from "./anwaltlicheVertretung/context";
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
  besitzZusammenfassungShowWarnings,
} from "./stringReplacements";
import { finanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";

export const beratungshilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(beratungshilfeFormularFlow, {
    meta: { arrays: finanzielleAngabenArrayConfig },
    states: {
      grundvoraussetzungen: _.merge(
        _.cloneDeep(beratungshilfeGrundvoraussetzungenFlow),
        {
          meta: { done: grundvoraussetzungDone },
          states: {
            start: { on: { BACK: "#antragStart" } },
            eigeninitiativeGrundvorraussetzung: {
              on: {
                SUBMIT: [
                  {
                    target: "#anwaltlicheVertretung.start",
                    guard: "grundvoraussetzungDone",
                  },
                  {
                    target: "eigeninitiativeGrundvorraussetzung-hinweis",
                  },
                ],
              },
            },
          },
        },
      ),
      anwaltlicheVertretung: _.merge(
        _.cloneDeep(beratungshilfeAnwaltlicheVertretungFlow),
        {
          meta: { done: anwaltlicheVertretungDone },
          states: {
            start: {
              on: {
                BACK: "#grundvoraussetzungen.eigeninitiativeGrundvorraussetzung",
              },
            },
            anwaltKontaktdaten: { on: { SUBMIT: "#rechtsproblem.start" } },
          },
        },
      ),

      rechtsproblem: _.merge(_.cloneDeep(rechtsproblemFlow), {
        meta: { done: rechtsproblemDone },
        states: {
          start: {
            on: {
              BACK: [
                {
                  guard: "anwaltskanzleiNo",
                  target: "#anwaltlicheVertretung.start",
                },
                {
                  guard: "beratungStattgefundenNo",
                  target: "#anwaltlicheVertretung.beratungStattgefunden",
                },
                {
                  target: "#anwaltlicheVertretung.anwaltKontaktdaten",
                },
              ],
            },
          },
          danke: {
            on: {
              SUBMIT: "#finanzielleAngaben.einkommen.staatliche-leistungen",
            },
          },
        },
      }),
      finanzielleAngaben: _.merge(_.cloneDeep(finanzielleAngabenFlow), {
        meta: {
          done: beratungshilfeFinanzielleAngabeDone,
          subflowState: beratungshilfeFinanzielleAngabenSubflowState,
        },
        states: {
          einkommen: {
            states: {
              "staatliche-leistungen": { on: { BACK: "#rechtsproblem.danke" } },
            },
          },
          danke: { on: { SUBMIT: "#persoenlicheDaten.start" } },
        },
      }),
      persoenlicheDaten: _.merge(_.cloneDeep(persoenlicheDatenFlow), {
        meta: { done: beratungshilfePersoenlicheDatenDone },
        states: {
          start: { on: { BACK: "#finanzielleAngaben.danke" } },
          danke: {
            on: {
              SUBMIT: [{ target: "#abgabe.art", guard: "readyForAbgabe" }],
            },
          },
        },
      }),
      abgabe: _.merge(_.cloneDeep(abgabeFlow), {
        states: {
          art: { on: { BACK: "#persoenlicheDaten.danke" } },
        },
      }),
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
    ...besitzZusammenfassungShowWarnings(context),
  }),
} as const;

export type BeratungshilfeFormularContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeAnwaltlicheVertretung &
  BeratungshilfeRechtsproblem &
  BeratungshilfeFinanzielleAngaben &
  BeratungshilfePersoenlicheDaten &
  BeratungshilfeAbgabe;
