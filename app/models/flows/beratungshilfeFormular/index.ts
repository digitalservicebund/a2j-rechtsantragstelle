import _ from "lodash";
import {
  type BeratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungenGuards,
  grundvoraussetzungDone,
} from "./grundvoraussetzung/context";
import beratungshilfeGrundvoraussetzungenFlow from "./grundvoraussetzung/flow.json";
import beratungshilfeAntragFlow from "./flow.json";
import rechtsproblemFlow from "./rechtsproblem/flow.json";
import {
  type BeratungshilfeRechtsproblem,
  beratungshilfeRechtsproblem,
  beratungshilfeRechtsproblemGuards,
  rechtsproblemDone,
} from "./rechtsproblem/context";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import abgabeFlow from "./abgabe/flow.json";
import { beratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { beratungshilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";

export const beratungshilfeAntrag = {
  cmsSlug: "form-flow-pages",
  flow: _.merge(beratungshilfeAntragFlow, {
    states: {
      grundvoraussetzungen: _.merge(
        _.cloneDeep(beratungshilfeGrundvoraussetzungenFlow),
        {
          meta: { done: grundvoraussetzungDone },
          states: {
            start: { on: { BACK: "#antragStart" } },
            eigeninitiativeGrundvorraussetzung: {
              on: {
                SUBMIT: {
                  target: "#rechtsproblem.start",
                  cond: "eigeninitiativeGrundvorraussetzungYes",
                },
              },
            },
          },
        },
      ),
      rechtsproblem: _.merge(_.cloneDeep(rechtsproblemFlow), {
        meta: { done: rechtsproblemDone },
        states: {
          start: {
            on: {
              BACK: "#grundvoraussetzungen.eigeninitiativeGrundvorraussetzung",
            },
          },
          danke: { on: { SUBMIT: "#finanzielleAngaben.start" } },
        },
      }),
      finanzielleAngaben: _.merge(_.cloneDeep(finanzielleAngabenFlow), {
        states: {
          start: { on: { BACK: "#rechtsproblem.danke" } },
          danke: { on: { SUBMIT: "#persoenlicheDaten.start" } },
        },
      }),
      persoenlicheDaten: _.merge(_.cloneDeep(persoenlicheDatenFlow), {
        states: {
          start: { on: { BACK: "#finanzielleAngaben.danke" } },
          danke: {
            on: {
              SUBMIT: { target: "#abgabe.uebersicht", cond: "readyForAbgabe" },
            },
          },
        },
      }),
      abgabe: _.merge(_.cloneDeep(abgabeFlow), {
        states: {
          uebersicht: { on: { BACK: "#persoenlicheDaten.danke" } },
        },
      }),
    },
  }),
  guards: {
    ...beratungshilfeGrundvoraussetzungenGuards,
    ...beratungshilfeRechtsproblemGuards,
    ...beratungshilfeAbgabeGuards,
  },
  context: {
    ...beratungshilfeGrundvoraussetzungen,
    ...beratungshilfeRechtsproblem,
    ...beratungshilfeFinanzielleAngaben,
    ...beratungshilfePersoenlicheDaten,
  },
} as const;

export type BeratungshilfeAntragContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeRechtsproblem;
