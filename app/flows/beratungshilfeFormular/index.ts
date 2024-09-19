import _ from "lodash";
import type { BeratungshilfePersoenlicheDaten } from "~/flows/beratungshilfeFormular/persoenlicheDaten/context";
import { beratungshilfePersoenlicheDatenDone } from "~/flows/beratungshilfeFormular/persoenlicheDaten/doneFunctions";
import type { Flow } from "~/flows/flows.server";
import type { FinanzielleAngabenPartnerTargetReplacements } from "~/flows/shared/finanzielleAngaben/partner";
import { getFinanzielleAngabenPartnerSubflow } from "~/flows/shared/finanzielleAngaben/partner";
import persoenlicheDatenFlow from "~/flows/shared/persoenlicheDaten/flow.json";
import abgabeFlow from "./abgabe/flow.json";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import { type BeratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import { beratungshilfeAnwaltlicheVertretungGuards } from "./anwaltlicheVertretung/guards";
import { type BeratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { partnerDone } from "./finanzielleAngaben/doneFunctions";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import { beratungshilfeFinanzielleAngabenXstateConfig } from "./finanzielleAngaben/xstateConfig";
import {
  type BeratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungenGuards,
} from "./grundvoraussetzung/context";
import { grundvorraussetzungXstateConfig } from "./grundvoraussetzung/xstateConfig";
import { type BeratungshilfeRechtsproblem } from "./rechtsproblem/context";
import {
  getAmtsgerichtStrings,
  getStaatlicheLeistungenStrings,
  getAnwaltStrings,
  getMissingInformationStrings,
  ausgabenStrings,
  weiteresEinkommenStrings,
  eigentumZusammenfassungShowTotalWorthWarnings,
} from "./stringReplacements";
import { beratungshilfeXstateConfig } from "./xstateConfig";
import type { AbgabeContext } from "../shared/abgabe/context";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../shared/stringReplacements";
import { anwaltlicheVertretungXstateConfig } from "./anwaltlicheVertretung/xstateConfig";
import { rechtsproblemXstateConfig } from "./rechtsproblem/xstateConfig";

export const beratungshilfeFinanzielleAngabenPartnerTargetReplacements: FinanzielleAngabenPartnerTargetReplacements =
  {
    backStep: "#einkommen.einkommen",
    playsNoRoleTarget: "#kinder.kinder-frage",
    partnerNameTarget: "#kinder.kinder-frage",
    partnerIncomeTarget: "partner-einkommen-summe",
    nextStep: "#kinder.kinder-frage",
  };

export const beratungshilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(beratungshilfeXstateConfig, {
    states: {
      grundvoraussetzungen: grundvorraussetzungXstateConfig,
      "anwaltliche-vertretung": anwaltlicheVertretungXstateConfig,
      rechtsproblem: rechtsproblemXstateConfig,
      "finanzielle-angaben": _.merge(
        beratungshilfeFinanzielleAngabenXstateConfig,
        {
          states: {
            partner: getFinanzielleAngabenPartnerSubflow(
              partnerDone,
              beratungshilfeFinanzielleAngabenPartnerTargetReplacements,
            ),
          },
        },
      ),
      "persoenliche-daten": _.merge(persoenlicheDatenFlow, {
        meta: { done: beratungshilfePersoenlicheDatenDone },
        states: {
          start: {
            on: {
              BACK: [
                {
                  guard:
                    finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeldAndEigentumDone,
                  target:
                    "#finanzielle-angaben.eigentum-zusammenfassung.zusammenfassung",
                },
                {
                  guard:
                    finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeldAndHasEigentum,
                  target: "#finanzielle-angaben.eigentum.gesamtwert",
                },
                {
                  guard:
                    finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeld,
                  target: "#finanzielle-angaben.eigentum.kraftfahrzeuge-frage",
                },
                {
                  guard: finanzielleAngabeGuards.hasAusgabenYes,
                  target: "#ausgaben.uebersicht",
                },
                {
                  guard: finanzielleAngabeGuards.hasNoStaatlicheLeistungen,
                  target: "#ausgaben.ausgaben-frage",
                },
                "#finanzielle-angaben.einkommen.staatliche-leistungen",
              ],
            },
          },
          telefonnummer: {
            on: {
              SUBMIT: "#abgabe",
            },
          },
        },
      }),
      abgabe: _.merge(abgabeFlow, {
        meta: { done: () => false },
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
    ...eigentumZusammenfassungShowPartnerschaftWarnings(context),
    ...eigentumZusammenfassungShowTotalWorthWarnings(context),
    ...getMissingInformationStrings(context),
    ...ausgabenStrings(context),
    ...geldAnlagenStrings(context),
    ...weiteresEinkommenStrings(context),
  }),
} satisfies Flow;

export type BeratungshilfeFormularContext = BeratungshilfeGrundvoraussetzungen &
  BeratungshilfeAnwaltlicheVertretung &
  BeratungshilfeRechtsproblem &
  BeratungshilfeFinanzielleAngaben &
  BeratungshilfePersoenlicheDaten &
  AbgabeContext;
