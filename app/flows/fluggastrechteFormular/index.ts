import _ from "lodash";
import type { AllContextKeys } from "~/flows/common";
import type { Flow } from "~/flows/flows.server";
import type { ArrayConfig } from "~/services/array";
import type { FlowTransitionConfig } from "~/services/session.server/flowTransitionValidation.server";
import abgabeFlow from "./abgabe/flow.json";
import type { FluggastrechtContext } from "./context";
import { flugdatenDone } from "./flugdaten/doneFunctions";
import flugdatenFlow from "./flugdaten/flow.json";
import { grundvoraussetzungenDone } from "./grundvoraussetzungen/doneFunctions";
import grundvoraussetzungenFlow from "./grundvoraussetzungen/flow.json";
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
import zusammenfassungFlow from "./zusammenfassung/flow.json";

const flowTransitionConfig: FlowTransitionConfig = {
  sourceFlowId: "/fluggastrechte/vorabcheck",
  eligibleSourcePages: ["ergebnis/erfolg"],
};

export const fluggastrechtFlow = {
  cmsSlug: "form-flow-pages",
  migration: {
    source: "/fluggastrechte/vorabcheck",
    orderFields: [
      "bereich",
      "startAirport",
      "endAirport",
      "fluggesellschaft",
      "zustaendigesAmtsgericht",
      "ankuendigung",
      "ersatzflug",
      "ersatzflugStartenEinStunde",
      "ersatzflugLandenZweiStunden",
      "ersatzflugStartenZweiStunden",
      "ersatzflugLandenVierStunden",
    ],
  },
  stringReplacements: (context: FluggastrechtContext) => ({
    ...getStartAirportName(context),
    ...getEndAirportName(context),
    ...getPersonVorname(context),
    ...getPersonNachname(context),
    ...getArrayWeiterePersonenIndexStrings(context),
    ...getWeiterePersonenNameStrings(context),
    ...getAirlineName(context),
  }),
  config: {
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
    id: "/fluggastrechte/formular",
    initial: "intro",
    states: {
      intro: {
        id: "intro",
        initial: "start",
        meta: { done: () => true },
        states: {
          start: {
            on: {
              SUBMIT: "#grundvoraussetzungen.prozessfaehig",
              BACK: "redirect-vorabcheck-ergebnis",
            },
          },
          "redirect-vorabcheck-ergebnis": { on: {} },
        },
      },
      grundvoraussetzungen: _.merge(grundvoraussetzungenFlow, {
        meta: { done: grundvoraussetzungenDone },
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
      zusammenfassung: _.merge(zusammenfassungFlow, {
        meta: { done: () => false },
      }),
      abgabe: _.merge(abgabeFlow, {
        meta: { done: () => false },
      }),
    },
  },
  guards: fluggastrechteGuards,
  flowTransitionConfig,
} satisfies Flow;
