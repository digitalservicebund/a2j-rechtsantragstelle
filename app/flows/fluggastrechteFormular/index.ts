import _ from "lodash";
import fluggastrechteFlow from "./flow.json";
import { fluggastrechteGuards } from "./guards";
import { type AllContexts } from "../common";
import { gerichtskostenFromBetrag } from "../gerichtskosten";
import persoenlicheDatenFlow from "../persoenlicheDaten/flow.json";

function forderungFromEntfernung(entfernung: number) {
  // TODO: handle negative distance?
  if (entfernung < 1500) return 250;
  if (entfernung < 3500) return 400;
  return 600;
}

export const fluggastrechtFlow = {
  migrationSource: "fluggastrechte/vorabcheck",
  stringReplacements: (context: AllContexts) => {
    if (!("zwischenstopps" in context)) return {};
    return {
      entfernung: context.entfernung?.toLocaleString("de"),
      startAirport: context.startAirport,
      endAirport: context.endAirport,
      zwischenstoppAirport: context.zwischenstoppFlughafen,
      forderung: forderungFromEntfernung(context.entfernung ?? 0).toString(),
      kosten: gerichtskostenFromBetrag(
        forderungFromEntfernung(context.entfernung ?? 0),
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
            on: { SUBMIT: "#forderung.entfernung" },
          },
        },
      }),
    },
  }),
  guards: fluggastrechteGuards,
} as const;
