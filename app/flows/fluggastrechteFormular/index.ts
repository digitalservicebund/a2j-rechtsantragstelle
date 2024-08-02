import _ from "lodash";
import { getRouteCompensationBetweenAirports } from "~/services/airports/getRouteCompensationBetweenAirports";
import type { FlowTransitionConfig } from "~/services/session.server/flowTransitionValidation.server";
import fluggastrechteFlow from "./flow.json";
import { fluggastrechteGuards } from "./guards";
import { type AllContexts } from "../common";
import { gerichtskostenFromBetrag } from "../gerichtskosten";
import persoenlicheDatenFlow from "../persoenlicheDaten/flow.json";

function forderungFromAirports(startAirport: string, endAirport: string) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );

  switch (routeCompensation) {
    case "notPossibleCalculateDistance": {
      return 0;
    }
    case "shortDistance": {
      return 250;
    }
    case "longDistanceInsideEU":
    case "middleDistance": {
      return 400;
    }
    case "longDistanceOutsideEU": {
      return 600;
    }
  }
}

const flowTransitionConfig: FlowTransitionConfig = {
  targetFlowId: "/fluggastrechte/formular",
  sourceFlowId: "/fluggastrechte/vorabcheck",
  eligibleSourcePages: [
    "ergebnis/erfolg",
    "ergebnis/erfolg-kontakt",
    "ergebnis/erfolg-gericht",
  ],
};

export const fluggastrechtFlow = {
  migrationSource: "/fluggastrechte/vorabcheck",
  stringReplacements: (context: AllContexts) => {
    if (!("zwischenstopps" in context)) return {};
    return {
      startAirport: context.startAirport,
      endAirport: context.endAirport,
      zwischenstoppAirport: context.zwischenstoppFlughafen,
      forderung: forderungFromAirports(
        context.startAirport ?? "",
        context.endAirport ?? "",
      ).toString(),
      kosten: gerichtskostenFromBetrag(
        forderungFromAirports(
          context.startAirport ?? "",
          context.endAirport ?? "",
        ),
      ).toString(),
    };
  },
  cmsSlug: "form-flow-pages",
  config: _.merge(fluggastrechteFlow, {
    states: {
      "persoenliche-daten": _.merge(_.cloneDeep(persoenlicheDatenFlow), {
        initial: "name",
        states: {
          name: { on: { BACK: "#flugdaten.anzahl" } },
          "bevollmaechtigte-person": {
            on: { SUBMIT: "#forderung.forderung" },
          },
        },
      }),
    },
  }),
  guards: fluggastrechteGuards,
  flowTransitionConfig,
} as const;
