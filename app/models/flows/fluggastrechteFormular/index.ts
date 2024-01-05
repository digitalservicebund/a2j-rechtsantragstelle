import _ from "lodash";
import fluggastrechteFlow from "./config.json";
import { fluggastrechtContext } from "./context";
import { fluggastrechteGuards } from "./guards";
import { type AllContexts } from "../common";
import { gerichtskostenFromBetrag } from "../gerichtskosten";
import persoenlicheDatenFlow from "../persoenlicheDaten/config.json";

function forderungFromEntfernung(entfernung: number) {
  return entfernung < 1500 ? 250 : entfernung < 3500 ? 400 : 600;
}

export const fluggastrechtFlow = {
  migrationSource: "fluggastrechte/vorabcheck",
  stringReplacements: (context: AllContexts) => {
    if (!("zwischenstopps" in context)) return {};
    return {
      entfernung: context.entfernung?.toString(),
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
  flow: _.merge(fluggastrechteFlow, {
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
  context: fluggastrechtContext,
} as const;
