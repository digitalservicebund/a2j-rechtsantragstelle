import { guards as beratungshilfeGuards } from "~/models/flows/beratungshilfe/guards";
import { guards as geldEinklagenGuards } from "~/models/flows/geldEinklagen/guards";
import { guards as geldEinklagenFormularGuards } from "~/models/flows/geldEinklagenFormular/guards";
import { guards as fluggastrechteVorabcheckGuards } from "~/models/flows/fluggastrechte/guards";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import geldEinklagenFormularFlow from "~/models/flows/geldEinklagenFormular/config.json";
import persoenlicheDatenFlow from "~/models/flows/persoenlicheDaten/config.json";
import fluggastrechteFlow from "~/models/flows/fluggastrechteFormular/config.json";
import fluggastrechteVorabcheckFlow from "~/models/flows/fluggastrechte/config.json";
import { context as geldEinklagenContext } from "~/models/flows/geldEinklagen/pages";
import {
  GeldEinklagenFormularContext,
  context as geldEinklagenFormularContext,
} from "~/models/flows/geldEinklagenFormular/context";
import { context as beratungshilfeContext } from "~/models/flows/beratungshilfe/pages";
import invariant from "tiny-invariant";
import type { Params } from "@remix-run/react";
import _ from "lodash";
import { fluggastrechtContext } from "~/models/flows/fluggastrechteFormular/context";
import { fluggastrechteVorabcheckContext } from "~/models/flows/fluggastrechte/context";
import { fluggastrechteGuards } from "~/models/flows/fluggastrechteFormular/guards";
import { forderungFromEntfernung } from "~/models/fluggastrechte";
import {
  gerichtskostenFromBetrag,
  gesamtKosten,
  getGerichtskostenvorschuss,
} from "~/models/geldEinklagen";
import { type AllContexts } from "~/models/flows/common";
import { getVerfuegbaresEinkommenFreibetrag } from "~/models/beratungshilfe";
import { beratungshilfeAntrag } from "~/models/flows/beratungshilfeFormular";

export const flowSpecifics = {
  "beratungshilfe/antrag": beratungshilfeAntrag,
  "beratungshilfe/vorabcheck": {
    cmsSlug: "vorab-check-pages",
    stringReplacements: (context: AllContexts) => {
      return {
        verfuegbaresEinkommenFreibetrag:
          getVerfuegbaresEinkommenFreibetrag(context).toString(),
      };
    },
    flow: beratungshilfeFlow,
    guards: beratungshilfeGuards,
    context: beratungshilfeContext,
  },
  "geld-einklagen/vorabcheck": {
    cmsSlug: "vorab-check-pages",
    stringReplacements: (context: AllContexts) => {
      return {
        gerichtskostenvorschuss: getGerichtskostenvorschuss(context).toString(),
      };
    },

    flow: geldEinklagenFlow,
    guards: geldEinklagenGuards,
    context: geldEinklagenContext,
  },
  "geld-einklagen/formular": {
    cmsSlug: "form-flow-pages",
    stringReplacements: (context: AllContexts) => {
      if (!("forderung" in context && typeof context.forderung === "object"))
        return {};
      const gesamtForderung = gesamtKosten(context);
      const berechneteGerichtskosten =
        gerichtskostenFromBetrag(gesamtForderung);

      return {
        forderung1Betrag: context.forderung?.forderung1?.betrag,
        forderung1Title: context.forderung?.forderung1?.title,
        forderung2Betrag: context.forderung?.forderung2?.betrag,
        forderung2Title: context.forderung?.forderung2?.title,
        gesamtForderung: gesamtForderung.toString(),
        berechneteGerichtskosten: berechneteGerichtskosten.toString(),
      };
    },
    flow: _.merge(geldEinklagenFormularFlow, {
      states: {
        "persoenliche-daten": _.merge(_.cloneDeep(persoenlicheDatenFlow), {
          meta: {
            done: (context: GeldEinklagenFormularContext) =>
              Boolean(
                context.anzahl &&
                  context.vorname &&
                  context.nachname &&
                  context.volljaehrig &&
                  context.strasseHausnummer &&
                  context.plz &&
                  context.ort &&
                  context.telefonnummer &&
                  context.gesetzlicheVertretung &&
                  context.bevollmaechtigtePerson,
              ),
          },
          states: {
            start: { on: { BACK: "#daten-uebernahme" } },
            "bevollmaechtigte-person": { on: { SUBMIT: "#gegenseite" } },
          },
        }),
        gegenseite: {
          meta: {
            done: (context: GeldEinklagenFormularContext) =>
              Boolean(
                (context.gegenseite?.typ === "privatperson" &&
                  context.gegenseite.privatperson?.vorname &&
                  context.gegenseite.privatperson?.nachname &&
                  context.gegenseite.privatperson?.strasseHausnummer &&
                  context.gegenseite.privatperson?.plz &&
                  context.gegenseite.privatperson?.ort &&
                  context.gegenseite.privatperson?.telefonnummer &&
                  context.gegenseite.privatperson?.bevollmaechtigtePerson &&
                  context.gegenseite.privatperson?.vorname) ||
                  (context.gegenseite?.typ === "unternehmen" &&
                    context.gegenseite.unternehmen?.name &&
                    context.gegenseite.unternehmen?.inhaber &&
                    context.gegenseite.unternehmen?.strasseHausnummer &&
                    context.gegenseite.unternehmen?.plz &&
                    context.gegenseite.unternehmen?.ort &&
                    context.gegenseite.unternehmen?.telefonnummer &&
                    context.gegenseite.unternehmen?.bevollmaechtigtePerson),
              ),
          },
        },
      },
    }),
    guards: geldEinklagenFormularGuards,
    context: geldEinklagenFormularContext,
  },
  "fluggastrechte/vorabcheck": {
    cmsSlug: "vorab-check-pages",
    flow: fluggastrechteVorabcheckFlow,
    guards: fluggastrechteVorabcheckGuards,
    context: fluggastrechteVorabcheckContext,
  },
  "fluggastrechte/formular": {
    migrationSource: "fluggastrechte/vorabcheck",
    stringReplacements: (context: AllContexts) => {
      if (!("zwischenstopps" in context)) return {};
      return {
        entfernung: context.entfernung?.toString(),
        endAirport: context.endAirport,
        forderung: forderungFromEntfernung(context.entfernung ?? 0).toString(),
        kosten: gerichtskostenFromBetrag(
          forderungFromEntfernung(context.entfernung ?? 0),
        ).toString(),
      };
    },
    cmsSlug: "form-flow-pages",
    flow: _.merge(fluggastrechteFlow, {
      states: {
        "persoenliche-daten": _.merge(_.cloneDeep(persoenlicheDatenFlow), {
          states: {
            anzahl: { on: { BACK: "#anzahl" } },
            "bevollmaechtigte-person": { on: { SUBMIT: "#entfernung" } },
          },
        }),
      },
    }),
    guards: fluggastrechteGuards,
    context: fluggastrechtContext,
  },
} as const;

export type FlowSpecifics = typeof flowSpecifics;
export type FlowId = keyof FlowSpecifics;

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
