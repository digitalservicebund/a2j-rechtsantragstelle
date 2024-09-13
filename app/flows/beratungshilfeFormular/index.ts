import _ from "lodash";
import type { Flow } from "~/flows/flows.server";
import type { TargetReplacements } from "~/flows/shared/finanzielleAngaben/partner";
import { getFinanzielleAngabenPartnerSubflow } from "~/flows/shared/finanzielleAngaben/partner";
import type { PersoenlicheDaten } from "~/flows/shared/persoenlicheDaten/context";
import { persoenlicheDatenDone } from "~/flows/shared/persoenlicheDaten/doneFunctions";
import abgabeFlow from "./abgabe/flow.json";
import { beratungshilfeAbgabeGuards } from "./abgabe/guards";
import { type BeratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import beratungshilfeAnwaltlicheVertretungFlow from "./anwaltlicheVertretung/flow.json";
import {
  beratungshilfeAnwaltlicheVertretungGuards,
  anwaltlicheVertretungDone,
} from "./anwaltlicheVertretung/guards";
import { finanzielleAngabenArrayConfig as beratungshilfeFormularFinanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";
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
import beratungshilfeFormularFlow from "./flow.json";
import {
  type BeratungshilfeGrundvoraussetzungen,
  beratungshilfeGrundvoraussetzungenGuards,
  grundvoraussetzungDone,
} from "./grundvoraussetzung/context";
import beratungshilfeGrundvoraussetzungenFlow from "./grundvoraussetzung/flow.json";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
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
import type { AbgabeContext } from "../shared/abgabe/context";
import { finanzielleAngabenArrayConfig } from "../shared/finanzielleAngaben/arrayConfiguration";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../shared/stringReplacements";

export const finanzielleAngabenPartnerTargetReplacements: TargetReplacements = {
  backStep: "#einkommen.einkommen",
  playsNoRoleTarget: "#kinder.kinder-frage",
  partnerNameTarget: "#kinder.kinder-frage",
  partnerIncomeTarget: "partner-einkommen-summe",
  nextStep: "#kinder.kinder-frage",
};

export const beratungshilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(beratungshilfeFormularFlow, {
    meta: {
      arrays: {
        ...finanzielleAngabenArrayConfig(
          "/beratungshilfe/antrag/finanzielle-angaben",
        ),
        ...beratungshilfeFormularFinanzielleAngabenArrayConfig(
          "/beratungshilfe/antrag/finanzielle-angaben",
        ),
      },
    },
    states: {
      start: { meta: { done: () => true } },
      grundvoraussetzungen: _.merge(beratungshilfeGrundvoraussetzungenFlow, {
        meta: { done: grundvoraussetzungDone },
      }),
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
            finanzielleAngabenPartnerTargetReplacements,
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
        meta: { done: persoenlicheDatenDone },
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
  PersoenlicheDaten &
  AbgabeContext;
