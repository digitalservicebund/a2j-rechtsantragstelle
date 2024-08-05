import _ from "lodash";
import { ProzesskostenhilfeEigentumContext } from "./finanzielleAngaben/context";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import prozesskostenhilfeFormularFlow from "./flow.json";
import { eigentumZusammenfassungDone } from "../beratungshilfeFormular/finanzielleAngaben/eigentumZusammenfassungDone";
import {
  eigentumDone,
  finanzielleAngabeGuards,
} from "../beratungshilfeFormular/finanzielleAngaben/guards";

export const prozesskostenhilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(prozesskostenhilfeFormularFlow, {
    states: {
      start: { meta: { done: () => true } },
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          eigentum: { meta: { done: eigentumDone } },
          "eigentum-zusammenfassung": {
            meta: { done: eigentumZusammenfassungDone },
          },
        },
      }),
    },
  }),
  guards: {
    ...finanzielleAngabeGuards,
  },
} as const;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeEigentumContext;
