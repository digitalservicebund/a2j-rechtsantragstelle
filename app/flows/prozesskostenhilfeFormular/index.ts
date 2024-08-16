import _ from "lodash";
import abgabeFlow from "./abgabe/flow.json";
import { prozesskostenhilfeAbgabeGuards } from "./abgabe/guards";
import { ProzesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import {
  eigentumDone,
  finanzielleAngabeGuards,
} from "./finanzielleAngaben/guards";
import prozesskostenhilfeFormularFlow from "./flow.json";
import { eigentumZusammenfassungDone } from "../beratungshilfeFormular/finanzielleAngaben/eigentumZusammenfassungDone";
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
    ...prozesskostenhilfeAbgabeGuards,
  },
  stringReplacements: (context: ProzesskostenhilfeFormularContext) => ({
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...eigentumZusammenfassungShowWarnings(context),
    ...geldAnlagenStrings(context),
  }),
} as const;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeFinanzielleAngabenContext & AbgabeContext;
