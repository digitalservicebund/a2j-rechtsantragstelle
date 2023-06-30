import { guards as beratungshilfeGuards } from "~/models/flows/beratungshilfe/guards";
import { guards as geldEinklagenGuards } from "~/models/flows/geldEinklagen/guards";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import { context as geldEinklagenContext } from "~/models/flows/geldEinklagen/pages";
import { context as beratungshilfeContext } from "~/models/flows/beratungshilfe/pages";

export const flowSpecifics = {
  beratungshilfe: {
    flow: beratungshilfeFlow,
    guards: beratungshilfeGuards,
    context: beratungshilfeContext,
  },
  "geld-einklagen": {
    flow: geldEinklagenFlow,
    guards: geldEinklagenGuards,
    context: geldEinklagenContext,
  },
} as const;
