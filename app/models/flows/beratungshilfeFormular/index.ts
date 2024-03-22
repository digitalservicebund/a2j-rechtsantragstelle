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
  beratungshilfeRechtsproblemGuards,
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
import type { ArrayConfig } from "~/services/array";

const flowId = "/beratungshilfe/antrag/";

const arrayConfigurations = {
  bankkonten: {
    url: `${flowId}finanzielleAngaben/besitzZusammenfassung/bankkonten`,
    initialInputUrl: "daten",
    questionUrl: `${flowId}finanzielleAngaben/besitz/bankkonten-frage`,
    statementKey: "hasBankkonto",
  },
  kraftfahrzeuge: {
    url: `${flowId}finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge`,
    initialInputUrl: "daten",
    questionUrl: `${flowId}finanzielleAngaben/besitz/kraftfahrzeuge-frage`,
    statementKey: "hasKraftfahrzeug",
  },
  geldanlagen: {
    url: `${flowId}finanzielleAngaben/besitzZusammenfassung/geldanlagen`,
    initialInputUrl: "daten",
    questionUrl: `${flowId}finanzielleAngaben/besitz/geldanlagen-frage`,
    statementKey: "hasGeldanlage",
  },
  grundeigentum: {
    url: `${flowId}finanzielleAngaben/besitzZusammenfassung/grundeigentum`,
    initialInputUrl: "daten",
    questionUrl: `${flowId}finanzielleAngaben/besitz/grundeigentum-frage`,
    statementKey: "hasGrundeigentum",
  },
  wertsachen: {
    url: `${flowId}finanzielleAngaben/besitzZusammenfassung/wertgegenstaende`,
    initialInputUrl: "daten",
    questionUrl: `${flowId}finanzielleAngaben/besitz/wertgegenstaende-frage`,
    statementKey: "hasWertsache",
  },
  kinder: {
    url: `${flowId}finanzielleAngaben/kinder/kinder`,
    initialInputUrl: `name`,
    questionUrl: `${flowId}finanzielleAngaben/kinder/kinder-frage`,
    statementKey: "hasKinder",
    hiddenFields: ["eigeneEinnahmen", "unterhalt"],
  },
} satisfies Record<string, ArrayConfig>;

export const beratungshilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(beratungshilfeFormularFlow, {
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
                    guard: "eigeninitiativeGrundvorraussetzungNo",
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
    ...beratungshilfeRechtsproblemGuards,
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
  arrayConfigurations,
} as const;

export type BeratungshilfeFormularContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeAnwaltlicheVertretung &
  BeratungshilfeRechtsproblem &
  BeratungshilfeFinanzielleAngaben &
  BeratungshilfePersoenlicheDaten &
  BeratungshilfeAbgabe;
