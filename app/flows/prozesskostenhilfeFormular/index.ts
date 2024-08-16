import _ from "lodash";
import abgabeFlow from "./abgabe/flow.json";
import { ProzesskostenhilfeEigentumContext } from "./finanzielleAngaben/context";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import prozesskostenhilfeFormularFlow from "./flow.json";
import { beratungshilfeAbgabeGuards } from "../beratungshilfeFormular/abgabe/guards";
import { eigentumZusammenfassungDone } from "../beratungshilfeFormular/finanzielleAngaben/eigentumZusammenfassungDone";
import {
  eigentumDone,
  finanzielleAngabeGuards,
} from "../beratungshilfeFormular/finanzielleAngaben/guards";
import {
  andereUnterhaltszahlungenDone,
  kinderDone,
  partnerDone,
} from "../beratungshilfeFormular/finanzielleAngaben/navStates";
import { AbgabeContext } from "../shared/abgabe/context";
import { finanzielleAngabenArrayConfig } from "../shared/finanzielleAngaben/arrayConfiguration";
import {
  eigentumZusammenfassungShowWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../shared/stringReplacements";

export const prozesskostenhilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(prozesskostenhilfeFormularFlow, {
    meta: {
      arrays: finanzielleAngabenArrayConfig(
        "/prozesskostenhilfe/antrag/finanzielle-angaben",
      ),
    },
    states: {
      start: { meta: { done: () => true } },
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          partner: { meta: { done: partnerDone } },
          kinder: { meta: { done: kinderDone } },
          "andere-unterhaltszahlungen": {
            meta: { done: andereUnterhaltszahlungenDone },
          },
          eigentum: { meta: { done: eigentumDone } },
          "eigentum-zusammenfassung": {
            meta: { done: eigentumZusammenfassungDone },
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
    ...beratungshilfeAbgabeGuards,
  },
  stringReplacements: (context: ProzesskostenhilfeFormularContext) => ({
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...eigentumZusammenfassungShowWarnings(context),
    ...geldAnlagenStrings(context),
  }),
} as const;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeEigentumContext & AbgabeContext;
