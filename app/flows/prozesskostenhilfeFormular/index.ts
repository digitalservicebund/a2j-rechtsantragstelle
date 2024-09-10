import _ from "lodash";
import type { Flow } from "~/flows/flows.server";
import { finanzielleAngabenArrayConfig as pkhFormularFinanzielleAngabenArrayConfig } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/arrayConfiguration";
import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { finanzielleAngabeEinkuenfteGuards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import type { FinanzielleAngabenPartnerTargetReplacements } from "~/flows/shared/finanzielleAngaben/partner";
import { getFinanzielleAngabenPartnerSubflow } from "~/flows/shared/finanzielleAngaben/partner";
import abgabeFlow from "./abgabe/flow.json";
import { prozesskostenhilfeAbgabeGuards } from "./abgabe/guards";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  ausgabenZusammenfassungDone,
  eigentumZusammenfassungDone,
  kinderDone,
  partnerDone,
} from "./finanzielleAngaben/doneFunctions";
import { eigentumDone } from "./finanzielleAngaben/eigentumDone";
import einkuenfteFlow from "./finanzielleAngaben/einkuenfte/flow.json";
import partnerEinkuenfteFlow from "./finanzielleAngaben/einkuenfte/partnerFlow.json";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import prozesskostenhilfeFormularFlow from "./flow.json";
import { getMissingInformationStrings } from "./stringReplacements";
import type { AbgabeContext } from "../shared/abgabe/context";
import { finanzielleAngabenArrayConfig } from "../shared/finanzielleAngaben/arrayConfiguration";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../shared/stringReplacements";

export const prozesskostenhilfeFinanzielleAngabenPartnerTargetReplacements: FinanzielleAngabenPartnerTargetReplacements =
  {
    backStep: "", // blank as we're overrriding later
    playsNoRoleTarget: "#partner-einkuenfte",
    partnerNameTarget: "#partner-einkuenfte",
    partnerIncomeTarget: "#kinder", // TODO: fix this after flow fully exists
    nextStep: "#andere-unterhaltszahlungen",
  };

export const prozesskostenhilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(prozesskostenhilfeFormularFlow, {
    meta: {
      arrays: {
        ...finanzielleAngabenArrayConfig(
          "/prozesskostenhilfe/formular/finanzielle-angaben",
        ),
        ...pkhFormularFinanzielleAngabenArrayConfig(
          "/prozesskostenhilfe/formular/finanzielle-angaben",
        ),
      },
    },
    states: {
      start: { meta: { done: () => true } },
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          einkuenfte: _.merge(einkuenfteFlow, {
            meta: { done: einkuenfteDone },
          }),
          partner: _.merge(
            getFinanzielleAngabenPartnerSubflow(
              partnerDone,
              prozesskostenhilfeFinanzielleAngabenPartnerTargetReplacements,
            ),
            // Need to override the default back step, as there's no way to interpolate a series of guards
            {
              states: {
                partnerschaft: {
                  on: {
                    BACK: [
                      {
                        guard: "hasFurtherIncome",
                        target: "#einkuenfte.weitere-einkuenfte.uebersicht",
                      },
                      "#einkuenfte.weitere-einkuenfte.frage",
                    ],
                  },
                },
              },
            },
          ),
          "partner-einkuenfte": _.merge(partnerEinkuenfteFlow, {
            meta: { done: einkuenfteDone }, // TODO: add proper partner einkuenfte done function
          }),
          kinder: { meta: { done: kinderDone } },
          "andere-unterhaltszahlungen": {
            meta: { done: andereUnterhaltszahlungenDone },
          },
          eigentum: { meta: { done: eigentumDone } },
          "eigentum-zusammenfassung": {
            meta: { done: eigentumZusammenfassungDone },
          },
          ausgaben: { meta: { done: ausgabenDone } },
          "ausgaben-zusammenfassung": {
            meta: { done: ausgabenZusammenfassungDone },
          },
        },
      }),
      abgabe: _.merge(abgabeFlow, {
        meta: { done: () => false },
      }),
    },
  }),
  guards: {
    ...finanzielleAngabeGuards,
    ...finanzielleAngabeEinkuenfteGuards,
    ...prozesskostenhilfeAbgabeGuards,
  },
  stringReplacements: (context: ProzesskostenhilfeFormularContext) => ({
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...eigentumZusammenfassungShowPartnerschaftWarnings(context),
    ...geldAnlagenStrings(context),
    ...getMissingInformationStrings(context),
  }),
} satisfies Flow;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeFinanzielleAngabenContext & AbgabeContext;
