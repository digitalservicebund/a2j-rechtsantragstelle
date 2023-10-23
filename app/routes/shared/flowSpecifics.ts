import { guards as beratungshilfeGuards } from "~/models/flows/beratungshilfe/guards";
import { guards as geldEinklagenGuards } from "~/models/flows/geldEinklagen/guards";
import { guards as geldEinklagenFormularGuards } from "~/models/flows/geldEinklagenFormular/guards";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import geldEinklagenFormularFlow from "~/models/flows/geldEinklagenFormular/config.json";
import persoenlicheDatenFlow from "~/models/flows/persoenlicheDaten/config.json";
import fluggastrechteFlow from "~/models/flows/fluggastrechte/config.json";
import { context as geldEinklagenContext } from "~/models/flows/geldEinklagen/pages";
import { context as geldEinklagenFormularContext } from "~/models/flows/geldEinklagenFormular/context";
import { context as beratungshilfeContext } from "~/models/flows/beratungshilfe/pages";
import invariant from "tiny-invariant";
import type { Params } from "@remix-run/react";
import _ from "lodash";
import { fluggastrechtContext } from "~/models/flows/fluggastrechte/context";

export const flowSpecifics = {
  "beratungshilfe/vorabcheck": {
    cmsSlug: "vorab-check-pages",
    flow: beratungshilfeFlow,
    guards: beratungshilfeGuards,
    context: beratungshilfeContext,
  },
  "geld-einklagen/vorabcheck": {
    cmsSlug: "vorab-check-pages",
    flow: geldEinklagenFlow,
    guards: geldEinklagenGuards,
    context: geldEinklagenContext,
  },
  "geld-einklagen/formular": {
    cmsSlug: "form-flow-pages",
    flow: _.merge(geldEinklagenFormularFlow, {
      states: {
        "persoenliche-daten": _.merge(_.cloneDeep(persoenlicheDatenFlow), {
          states: {
            start: { on: { BACK: "#daten-uebernahme" } },
            "bevollmaechtigte-person": { on: { SUBMIT: "#gegenseite" } },
          },
        }),
      },
    }),
    guards: geldEinklagenFormularGuards,
    context: geldEinklagenFormularContext,
  },
  "geld-einklagen/fluggastrechte": {
    cmsSlug: "form-flow-pages",
    flow: _.merge(fluggastrechteFlow, {
      states: {
        "persoenliche-daten": _.merge(_.cloneDeep(persoenlicheDatenFlow), {
          states: {
            start: { on: { BACK: "#start" } },
            "bevollmaechtigte-person": { on: { SUBMIT: "#versaeumnisurteil" } },
          },
        }),
      },
    }),
    guards: {},
    context: fluggastrechtContext,
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
