import _ from "lodash";
import type { FlowTransitionConfig } from "~/services/session.server/flowTransitionValidation.server";
import { FluggastrechtContext } from "./context";
import fluggastrechteFlow from "./flow.json";
import flugdatenFlow from "./flugdaten/flow.json";
import forderungDatenFlow from "./forderung/flow.json";
import { fluggastrechteGuards } from "./guards";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
import { weiterePersonenDone } from "./persoenlicheDaten/navStates";
import {
  getEndAirportName,
  getForderung,
  getGerichtskostenFromBetrag,
  getPersonNachname,
  getPersonVorname,
  getStartAirportName,
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
    ...getPersonVorname(context),
    ...getPersonNachname(context),
  }),
  config: _.merge(fluggastrechteFlow, {
    meta: {
      arrays: {
        weiterePersonen: {
          url: "/fluggastrechte/formular/persoenliche-daten/weitere-personen/person",
          initialInputUrl: "daten",
          statementUrl:
            "/fluggastrechte/formular/persoenliche-daten/weitere-personen/uebersicht",
          statementKey: "showAlways",
          event: "add-weitere-personen",
        },
      },
    },
    states: {
      flugdaten: _.merge(flugdatenFlow, {}),
      "persoenliche-daten": _.merge(persoenlicheDatenFlow, {
        states: {
          person: { meta: { done: () => true } },
          "weitere-personen": { meta: { done: weiterePersonenDone } },
        },
      }),
      forderung: _.merge(forderungDatenFlow, {}),
      versand: _.merge(versandFlow, {}),
    },
  }),
  guards: fluggastrechteGuards,
  flowTransitionConfig,
} as const;
