import { guards as beratungshilfeGuards } from "~/models/flows/beratungshilfe/guards";
import { guards as geldEinklagenGuards } from "~/models/flows/geldEinklagen/guards";
import { guards as geldEinklagenFormularGuards } from "~/models/flows/geldEinklagenFormular/guards";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import geldEinklagenFormularFlow from "~/models/flows/geldEinklagenFormular/config.json";
import { context as geldEinklagenContext } from "~/models/flows/geldEinklagen/pages";
import { context as geldEinklagenFormularContext } from "~/models/flows/geldEinklagenFormular/context";
import { context as beratungshilfeContext } from "~/models/flows/beratungshilfe/pages";
import invariant from "tiny-invariant";
import type { Params } from "@remix-run/react";

export const flowSpecifics = {
  "beratungshilfe/vorabcheck": {
    flow: beratungshilfeFlow,
    guards: beratungshilfeGuards,
    context: beratungshilfeContext,
  },
  "geld-einklagen/vorabcheck": {
    flow: geldEinklagenFlow,
    guards: geldEinklagenGuards,
    context: geldEinklagenContext,
  },
  "geld-einklagen/formular": {
    flow: geldEinklagenFormularFlow,
    guards: geldEinklagenFormularGuards,
    context: geldEinklagenFormularContext,
  },
} as const;

export type FlowId = keyof typeof flowSpecifics;

export function flowIDFromPathname(pathname: string) {
  const flowID = [pathname.split("/")[1], pathname.split("/")[2]].join("/");
  if (!(flowID in flowSpecifics)) throw Error("Unknown flow ID");
  return flowID as FlowId;
}

export function splatFromParams(params: Params) {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");
  return splat;
}
