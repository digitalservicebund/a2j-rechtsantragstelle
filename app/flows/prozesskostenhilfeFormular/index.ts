import _ from "lodash";
import type { Flow } from "~/flows/flows.server";
import type { GenericGuard } from "~/flows/guards.server";
import { finanzielleAngabenArrayConfig as pkhFormularFinanzielleAngabenArrayConfig } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/arrayConfiguration";
import { eigentumDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/eigentumDone";
import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { getProzesskostenhilfeEinkuenfteSubflow } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/flow";
import { finanzielleAngabeEinkuenfteGuards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import {
  getFinanzielleAngabenPartnerSubflow,
  type FinanzielleAngabenPartnerTargetReplacements,
} from "~/flows/shared/finanzielleAngaben/partner";
import type { FinanzielleAngabenPartnerContext } from "~/flows/shared/finanzielleAngaben/partner/context";
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
    partnerIncomeTarget: "#partner-einkuenfte",
    nextStep: "#kinder",
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
          einkuenfte: getProzesskostenhilfeEinkuenfteSubflow(einkuenfteDone),
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
                "partner-einkuenfte": getProzesskostenhilfeEinkuenfteSubflow(
                  einkuenfteDone,
                  "partner",
                ),
              },
            },
          ),
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
    ...Object.fromEntries(
      // Need to both prepend "partner-" to guard name, and pass correct context subset to guard, to achieve the correct guarded outcome
      Object.entries(finanzielleAngabeEinkuenfteGuards).map(
        ([key, guard]: [
          string,
          GenericGuard<ProzesskostenhilfeFinanzielleAngabenContext>,
        ]) => [
          `partner-${key}`,
          ({
            context,
          }: {
            context: ProzesskostenhilfeFinanzielleAngabenContext;
          }) =>
            context.partnerEinkuenfte
              ? guard({ context: context.partnerEinkuenfte })
              : true,
        ],
      ),
    ),
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
  ProzesskostenhilfeFinanzielleAngabenContext &
    FinanzielleAngabenPartnerContext &
    AbgabeContext;
