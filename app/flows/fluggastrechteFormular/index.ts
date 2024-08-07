import _ from "lodash";
import type { FlowTransitionConfig } from "~/services/session.server/flowTransitionValidation.server";
import { FluggastrechtContext } from "./context";
import fluggastrechteFlow from "./flow.json";
import forderungDatenFlow from "./forderung/flow.json";
import { fluggastrechteGuards } from "./guards";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import {
  getEndAirportName,
  getForderung,
  getGerichtskostenFromBetrag,
  getPersonNachname,
  getPersonVorname,
  getStartAirportName,
  getZwischenstoppAirport,
} from "./stringReplacements";
import versandFlow from "./versand/flow.json";

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
  cmsSlug: "form-flow-pages",
  migrationSource: "/fluggastrechte/vorabcheck",
  stringReplacements: (context: FluggastrechtContext) => ({
    ...getStartAirportName(context),
    ...getEndAirportName(context),
    ...getForderung(context),
    ...getGerichtskostenFromBetrag(context),
    ...getZwischenstoppAirport(context),
    ...getPersonVorname(context),
    ...getPersonNachname(context),
  }),
  config: _.merge(fluggastrechteFlow, {
    states: {
      "persoenliche-daten": _.merge(persoenlicheDatenFlow, {}),
      forderung: _.merge(forderungDatenFlow, {}),
      versand: _.merge(versandFlow, {}),
    },
  }),
  guards: {
    ...fluggastrechteGuards,
    ...persoenlichDatenGuards,
  },
  flowTransitionConfig,
} as const;
