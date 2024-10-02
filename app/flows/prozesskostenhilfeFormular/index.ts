import _ from "lodash";
import type { Flow } from "~/flows/flows.server";
import { finanzielleAngabenArrayConfig as pkhFormularFinanzielleAngabenArrayConfig } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/arrayConfiguration";
import { eigentumDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/eigentumDone";
import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { getProzesskostenhilfeEinkuenfteSubflow } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/flow";
import {
  finanzielleAngabeEinkuenfteGuards,
  partnerEinkuenfteGuards,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import type { ProzesskostenhilfeGrundvoraussetzungenContext } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import { grundvoraussetzungenXstateConfig } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/xStateConfig";
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
      grundvoraussetzungen: grundvoraussetzungenXstateConfig,
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          einkuenfte: getProzesskostenhilfeEinkuenfteSubflow(einkuenfteDone),
          partner: _.merge(
            getFinanzielleAngabenPartnerSubflow(partnerDone, {
              backStep: "", // blank as we're overriding later
              playsNoRoleTarget: "#partner-einkuenfte",
              partnerNameTarget: "#partner-einkuenfte",
              partnerIncomeTarget: "#partner-einkuenfte",
              nextStep: "#kinder",
            }),
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
                "partner-einkuenfte": _.merge(
                  getProzesskostenhilfeEinkuenfteSubflow(
                    einkuenfteDone,
                    "partner",
                  ),
                  {
                    states: {
                      "partner-besonders-ausgaben": {
                        on: {
                          BACK: [
                            {
                              guard: partnerEinkuenfteGuards.hasFurtherIncome,
                              target:
                                "#partner-weitere-einkuenfte.partner-uebersicht",
                            },
                            "#partner-weitere-einkuenfte",
                          ],
                          SUBMIT: [
                            {
                              guard: "partnerHasBesondersAusgabenYes",
                              target: "add-partner-besonders-ausgaben",
                            },
                            "#kinder",
                          ],
                        },
                      },
                      "add-partner-besonders-ausgaben": {
                        on: {
                          SUBMIT: "#kinder",
                          BACK: "partner-besonders-ausgaben",
                        },
                      },
                    },
                  },
                ),
              },
            },
          ),
          kinder: {
            meta: { done: kinderDone },
            states: {
              "kinder-frage": {
                on: {
                  BACK: [
                    {
                      guard: "hasPartnerschaftNo",
                      target: "#partner",
                    },
                    {
                      guard: "partnerEinkommenNo",
                      target: "#partner.partner-einkommen",
                    },
                    {
                      guard:
                        partnerEinkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen,
                      target:
                        "#partner-einkuenfte.partner-staatliche-leistungen",
                    },
                    {
                      guard: "partnerHasBesondersAusgabenYes",
                      target:
                        "#partner-einkuenfte.add-partner-besonders-ausgaben",
                    },
                    "#partner-einkuenfte.partner-besonders-ausgaben",
                  ],
                },
              },
            },
          },
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
  ProzesskostenhilfeGrundvoraussetzungenContext &
    ProzesskostenhilfeFinanzielleAngabenContext &
    AbgabeContext;
