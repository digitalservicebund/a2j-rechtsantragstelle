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
import beratungshilfeAntragFlow from "./flow.json";
import rechtsproblemFlow from "./rechtsproblem/flow.json";
import {
  type BeratungshilfeRechtsproblem,
  beratungshilfeRechtsproblemGuards,
  rechtsproblemDone,
} from "./rechtsproblem/context";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import abgabeFlow from "./abgabe/flow.json";
import {
  type BeratungshilfeFinanzielleAngaben,
  beratungshilfeFinanzielleAngabeDone,
  beratungshilfeFinanzielleAngabenSubflowState,
} from "./finanzielleAngaben/context";
import {
  type BeratungshilfePersoenlicheDaten,
  beratungshilfePersoenlicheDatenDone,
} from "./persoenlicheDaten/context";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import type { AllContexts } from "~/models/flows/common";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import type { BeratungshilfeAbgabe } from "~/models/flows/beratungshilfeFormular/abgabe/context";

export const beratungshilfeAntrag = {
  cmsSlug: "form-flow-pages",
  config: _.merge(beratungshilfeAntragFlow, {
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
                    cond: "eigeninitiativeGrundvorraussetzungNo",
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
                  cond: "anwaltskanzleiNo",
                  target: "#anwaltlicheVertretung.start",
                },
                {
                  cond: "beratungStattgefundenNo",
                  target: "#anwaltlicheVertretung.beratungStattgefunden",
                },
                {
                  target: "#anwaltlicheVertretung.anwaltKontaktdaten",
                },
              ],
            },
          },
          danke: { on: { SUBMIT: "#finanzielleAngaben" } },
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
          danke: { on: { SUBMIT: "#persoenlicheDaten" } },
        },
      }),
      persoenlicheDaten: _.merge(_.cloneDeep(persoenlicheDatenFlow), {
        meta: { done: beratungshilfePersoenlicheDatenDone },
        states: {
          start: { on: { BACK: "#finanzielleAngaben.danke" } },
          danke: {
            on: {
              SUBMIT: [{ target: "#abgabe.art", cond: "readyForAbgabe" }],
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
    ...beratungshilfeRechtsproblemGuards,
    ...beratungshilfeAbgabeGuards,
    ...finanzielleAngabeGuards,
  },
  stringReplacements: (context: AllContexts) => ({
    ...getAmtsgerichtStrings(context),
  }),
} as const;

const getAmtsgerichtStrings = (context: AllContexts) => {
  if ("plz" in context && context.plz) {
    try {
      const courtData = findCourt({ zipCode: context.plz });
      return {
        courtName: courtData?.BEZEICHNUNG,
        courtStreetNumber: courtData?.STR_HNR,
        courtPlz: courtData?.PLZ_ZUSTELLBEZIRK,
        courtOrt: courtData?.ORT,
        courtWebsite: courtData?.URL1,
        courtTelephone: courtData?.TEL,
      };
    } catch (e) {
      console.error(`Did not find court for plz: ${context.plz}`, e);
    }
  }
  return {};
};

export type BeratungshilfeAntragContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeAnwaltlicheVertretung &
  BeratungshilfeRechtsproblem &
  BeratungshilfeFinanzielleAngaben &
  BeratungshilfePersoenlicheDaten &
  BeratungshilfeAbgabe;
