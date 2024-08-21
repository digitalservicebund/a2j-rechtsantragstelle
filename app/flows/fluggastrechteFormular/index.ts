import _ from "lodash";
import type { FlowTransitionConfig } from "~/services/session.server/flowTransitionValidation.server";
import { FluggastrechtContext } from "./context";
import fluggastrechteFlow from "./flow.json";
import flugdatenFlow from "./flugdaten/flow.json";
import forderungDatenFlow from "./forderung/flow.json";
import { fluggastrechteGuards } from "./guards";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
import { personDone, weiterePersonenDone } from "./persoenlicheDaten/navStates";
import {
  getArrayWeiterePersonenIndexStrings,
  getEndAirportName,
  getForderung,
  getGerichtskostenFromBetrag,
  getPersonNachname,
  getPersonVorname,
  getStartAirportName,
  getWeiterePersonenNameStrings,
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
    ...getArrayWeiterePersonenIndexStrings(context),
    ...getWeiterePersonenNameStrings(context),
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
          hiddenFields: ["anrede", "title"],
          event: "add-weitere-personen",
        },
      },
    },
    states: {
      flugdaten: _.merge(flugdatenFlow, {}),
      "persoenliche-daten": _.merge(persoenlicheDatenFlow, {
        states: {
          person: { meta: { done: personDone } },
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
