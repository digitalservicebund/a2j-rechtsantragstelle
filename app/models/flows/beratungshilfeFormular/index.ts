import _ from "lodash";
import {
  BeratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungenGuards,
} from "./grundvoraussetzung/context";
import beratungshilfeGrundvoraussetzungenFlow from "./grundvoraussetzung/flow.json";
import beratungshilfeAntragFlow from "./flow.json";
import rechtsproblemFlow from "./rechtsproblem/flow.json";
import {
  BeratungshilfeRechtsproblem,
  beratungshilfeRechtsproblem,
  beratungshilfeRechtsproblemGuards,
} from "./rechtsproblem/context";

export const beratungshilfeAntrag = {
  cmsSlug: "form-flow-pages",
  flow: _.merge(beratungshilfeAntragFlow, {
    states: {
      grundvoraussetzungen: _.merge(
        _.cloneDeep(beratungshilfeGrundvoraussetzungenFlow),
        {
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
        states: {
          start: {
            on: {
              BACK: "#grundvoraussetzungen.eigeninitiativeGrundvorraussetzung",
            },
          },
        },
      }),
    },
  }),
  guards: {
    ...beratungshilfeGrundvoraussetzungenGuards,
    ...beratungshilfeRechtsproblemGuards,
  },
  context: {
    ...beratungshilfeGrundvoraussetzungen,
    ...beratungshilfeRechtsproblem,
  },
} as const;

export type BeratungshilfeAntragContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeRechtsproblem;
