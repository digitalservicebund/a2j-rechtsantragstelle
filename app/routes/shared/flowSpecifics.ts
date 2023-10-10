import { guards as beratungshilfeGuards } from "~/models/flows/beratungshilfe/guards";
import { guards as geldEinklagenGuards } from "~/models/flows/geldEinklagen/guards";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import { context as geldEinklagenContext } from "~/models/flows/geldEinklagen/pages";
import { context as beratungshilfeContext } from "~/models/flows/beratungshilfe/pages";
import invariant from "tiny-invariant";
import type { Params } from "@remix-run/react";

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

export function flowIDFromPathname(pathname: string) {
  const flowID = pathname.split("/")[1];
  if (!(flowID in flowSpecifics)) throw Error("Unknown flow ID");
  return flowID as keyof typeof flowSpecifics;
}

export function splatFromParams(params: Params) {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");
  return splat;
}
