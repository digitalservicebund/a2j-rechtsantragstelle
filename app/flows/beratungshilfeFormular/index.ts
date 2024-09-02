import _ from "lodash";
import type { Flow } from "~/flows/flows.server";
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
  eigentumDone,
  einkommenDone,
  kinderDone,
  partnerDone,
  wohnungDone,
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
import {
  type BeratungshilfePersoenlicheDaten,
  beratungshilfePersoenlicheDatenDone,
} from "./persoenlicheDaten/context";
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
} from "./stringReplacements";
import type { AbgabeContext } from "../shared/abgabe/context";
import { finanzielleAngabenArrayConfig } from "../shared/finanzielleAngaben/arrayConfiguration";
import {
  eigentumZusammenfassungShowWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../shared/stringReplacements";

export const beratungshilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(beratungshilfeFormularFlow, {
    meta: {
      arrays: finanzielleAngabenArrayConfig(
        "/beratungshilfe/antrag/finanzielle-angaben",
      ),
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
          partner: { meta: { done: partnerDone } },
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
    ...eigentumZusammenfassungShowWarnings(context),
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
