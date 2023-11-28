import _ from "lodash";
import fluggastrechteFlow from "./config.json";
import { fluggastrechtContext } from "./context";
import { fluggastrechteGuards } from "./guards";
import { type AllContexts } from "../common";
import { gerichtskostenFromBetrag } from "~/models/geldEinklagen";
import persoenlicheDatenFlow from "../persoenlicheDaten/config.json";
import { forderungFromEntfernung } from "~/models/fluggastrechte";

export const fluggastrechtFlow = {
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
} as const;
