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
import beratungshilfeAnwaltlicheVertretungFlow from "./anwaltlicheVertretung/flow.json";
import {
  beratungshilfeAnwaltlicheVertretungGuards,
  anwaltlicheVertretungDone,
} from "./anwaltlicheVertretung/guards";
import { type BeratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  einkommenDone,
  kinderDone,
  partnerDone,
  wohnungDone,
  eigentumDone,
} from "./finanzielleAngaben/doneFunctions";
import { eigentumZusammenfassungDone } from "./finanzielleAngaben/eigentumZusammenfassungDone";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import {
  type BeratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungenGuards,
} from "./grundvoraussetzung/context";
import { grundvorraussetzungXstateConfig } from "./grundvoraussetzung/xstateConfig";
import {
  type BeratungshilfeRechtsproblem,
  rechtsproblemDone,
} from "./rechtsproblem/context";
import rechtsproblemFlow from "./rechtsproblem/flow.json";
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
      "anwaltliche-vertretung": _.merge(
        beratungshilfeAnwaltlicheVertretungFlow,
        {
          meta: { done: anwaltlicheVertretungDone },
        },
      ),
      rechtsproblem: _.merge(rechtsproblemFlow, {
        meta: { done: rechtsproblemDone },
      }),
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          einkommen: { meta: { done: einkommenDone } },
          partner: getFinanzielleAngabenPartnerSubflow(
            partnerDone,
            beratungshilfeFinanzielleAngabenPartnerTargetReplacements,
          ),
          kinder: { meta: { done: kinderDone } },
          "andere-unterhaltszahlungen": {
            meta: { done: andereUnterhaltszahlungenDone },
          },
          eigentum: { meta: { done: eigentumDone } },
          "eigentum-zusammenfassung": {
            meta: { done: eigentumZusammenfassungDone },
          },
          wohnung: { meta: { done: wohnungDone } },
          ausgaben: { meta: { done: ausgabenDone } },
        },
      }),
      "persoenliche-daten": _.merge(persoenlicheDatenFlow, {
        meta: { done: beratungshilfePersoenlicheDatenDone },
        states: {
          start: {
            on: {
              BACK: [
                {
                  guard: "staatlicheLeistungenIsBuergergeldAndEigentumDone",
                  target:
                    "#finanzielle-angaben.eigentum-zusammenfassung.zusammenfassung",
                },
                {
                  guard: "staatlicheLeistungenIsBuergergeldAndHasEigentum",
                  target: "#finanzielle-angaben.eigentum.gesamtwert",
                },
                {
                  guard: "staatlicheLeistungenIsBuergergeld",
                  target: "#finanzielle-angaben.eigentum.kraftfahrzeuge-frage",
                },
                {
                  guard: "hasAusgabenYes",
                  target: "#ausgaben.uebersicht",
                },
                {
                  guard: "hasNoStaatlicheLeistungen",
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
