import _ from "lodash";
import type { AllContextKeys } from "~/flows/common";
import type { Flow } from "~/flows/flows.server";
import type { ArrayConfig } from "~/services/array";
import type { FlowTransitionConfig } from "~/services/session.server/flowTransitionValidation.server";
import type { FluggastrechtContext } from "./context";
import fluggastrechteFlow from "./flow.json";
import { flugdatenDone } from "./flugdaten/doneFunctions";
import flugdatenFlow from "./flugdaten/flow.json";
import { grundvorraussetzungenDone } from "./grundvorraussetzungen/doneFunctions";
import grundvorraussetzungenFlow from "./grundvorraussetzungen/flow.json";
import { fluggastrechteGuards } from "./guards";
import {
  personDone,
  weiterePersonenDone,
} from "./persoenlicheDaten/doneFunctions";
import persoenlicheDatenFlow from "./persoenlicheDaten/flow.json";
import { streitwertKostenDone } from "./streitwertKosten/doneFunctions";
import streitwertKostenFlow from "./streitwertKosten/flow.json";
import {
  getAirlineName,
  getArrayWeiterePersonenIndexStrings,
  getEndAirportName,
  getPersonNachname,
  getPersonVorname,
  getStartAirportName,
  getWeiterePersonenNameStrings,
} from "./stringReplacements";

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
    ...getPersonVorname(context),
    ...getPersonNachname(context),
    ...getArrayWeiterePersonenIndexStrings(context),
    ...getWeiterePersonenNameStrings(context),
    ...getAirlineName(context),
  }),
  config: _.merge(fluggastrechteFlow, {
    meta: {
      arrays: {
        weiterePersonen: {
          url: "/fluggastrechte/formular/persoenliche-daten/weitere-personen/person",
          initialInputUrl: "daten",
          statementUrl:
            "/fluggastrechte/formular/persoenliche-daten/weitere-personen/uebersicht",
          statementKey: "isWeiterePersonen",
          hiddenFields: ["anrede", "title"],
          event: "add-weiterePersonen",
        },
      } satisfies Partial<Record<AllContextKeys, ArrayConfig>>,
    },
    states: {
      grundvorraussetzungen: _.merge(grundvorraussetzungenFlow, {
        meta: { done: grundvorraussetzungenDone },
      }),
      "streitwert-kosten": _.merge(streitwertKostenFlow, {
        meta: { done: streitwertKostenDone },
      }),
      flugdaten: _.merge(flugdatenFlow, { meta: { done: flugdatenDone } }),
      "persoenliche-daten": _.merge(persoenlicheDatenFlow, {
        states: {
          person: { meta: { done: personDone } },
          "weitere-personen": { meta: { done: weiterePersonenDone } },
        },
      }),
    },
  }),
  guards: fluggastrechteGuards,
  flowTransitionConfig,
} satisfies Flow;
