import _ from "lodash";
import {
  type BeratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungenGuards,
} from "./grundvoraussetzung/context";
import beratungshilfeGrundvoraussetzungenFlow from "./grundvoraussetzung/flow.json";
import beratungshilfeAntragFlow from "./flow.json";
import rechtsproblemFlow from "./rechtsproblem/flow.json";
import {
  type BeratungshilfeRechtsproblem,
  beratungshilfeRechtsproblem,
  beratungshilfeRechtsproblemGuards,
} from "./rechtsproblem/context";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import abgabeFlow from "./abgabe/flow.json";

export const beratungshilfeAntrag = {
  cmsSlug: "form-flow-pages",
  flow: _.merge(beratungshilfeAntragFlow, {
    states: {
      grundvoraussetzungen: _.merge(
        _.cloneDeep(beratungshilfeGrundvoraussetzungenFlow),
        {
          states: {
            start: { on: { BACK: "#antragStart" } },
            beratungshilfeBeantragt: {
              on: {
                SUBMIT: {
                  target: "#rechtsproblem.start",
                  cond: "beratungshilfeBeantragtNo",
                },
              },
            },
          },
        },
      ),
      rechtsproblem: _.merge(_.cloneDeep(rechtsproblemFlow), {
        states: {
          start: {
            on: { BACK: "#grundvoraussetzungen.beratungshilfeBeantragt" },
          },
          danke: {
            on: {
              SUBMIT: { target: "#abgabe.uebersicht", cond: "readyForAbgabe" },
            },
          },
        },
      }),
      abgabe: _.merge(_.cloneDeep(abgabeFlow), {
        states: {
          uebersicht: {
            on: { BACK: "#rechtsproblem.danke" },
          },
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
  },
} as const;

export type BeratungshilfeAntragContext = BeratungshilfeRechtsproblem &
  BeratungshilfeGrundvoraussetzungen;
