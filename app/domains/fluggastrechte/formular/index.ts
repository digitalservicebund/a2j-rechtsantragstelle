import _ from "lodash";
import type { AllContextKeys } from "~/domains/common";
import type { Flow } from "~/domains/flows.server";
import type { ArrayConfigServer } from "~/services/array";
import type { FlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";
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
import { prozessfuehrungDone } from "./prozessfuehrung/doneFunctions";
import prozessfuehrungFlow from "./prozessfuehrung/flow.json";
import { isTotalClaimWillSucceddedAboveLimit } from "./services/isTotalClaimAboveLimit";
import { streitwertKostenDone } from "./streitwertKosten/doneFunctions";
import streitwertKostenFlow from "./streitwertKosten/flow.json";
import {
  getAirlineName,
  getAnnullierungInfo,
  getArrayWeiterePersonenIndexStrings,
  getEndAirportName,
  getFirstZwischenstoppAirportName,
  getPersonNachname,
  getPersonVorname,
  getResponsibleCourt,
  getSecondZwischenstoppAirportName,
  getStartAirportName,
  getStreitwert,
  getThirdZwischenstoppAirportName,
  getWeiterePersonenNameStrings,
  isAnnullierung,
  isNichtBefoerderung,
  isVerspaetet,
  isWeiterePersonen,
} from "./stringReplacements";
import zusammenfassungFlow from "./zusammenfassung/flow.json";

const flowTransitionConfig: FlowTransitionConfig = {
  sourceFlowId: "/fluggastrechte/vorabcheck",
  eligibleSourcePages: ["/ergebnis/erfolg"],
};

export const fluggastrechtFlow = {
  flowType: "formFlow",
  migration: {
    source: "/fluggastrechte/vorabcheck",
    sortedFields: [
      "bereich",
      "startAirport",
      "endAirport",
      "fluggesellschaft",
      "ankuendigung",
      "ersatzflug",
      "ersatzflugStartenEinStunde",
      "ersatzflugLandenZweiStunden",
      "ersatzflugStartenZweiStunden",
      "ersatzflugLandenVierStunden",
      "entschaedigung",
    ],
    buttonUrl: "/fluggastrechte/vorabcheck/start",
  },
  stringReplacements: (context: FluggastrechtContext) => ({
    ...getStartAirportName(context),
    ...getEndAirportName(context),
    ...getPersonVorname(context),
    ...getPersonNachname(context),
    ...getArrayWeiterePersonenIndexStrings(context),
    ...getWeiterePersonenNameStrings(context),
    ...getAirlineName(context),
    ...getFirstZwischenstoppAirportName(context),
    ...getSecondZwischenstoppAirportName(context),
    ...getThirdZwischenstoppAirportName(context),
    ...getResponsibleCourt(context),
    ...isVerspaetet(context),
    ...isNichtBefoerderung(context),
    ...isAnnullierung(context),
    ...isWeiterePersonen(context),
    ...getStreitwert(context),
    ...getAnnullierungInfo(context),
    isClaimWillSucceddedAboveLimit:
      isTotalClaimWillSucceddedAboveLimit(context),
  }),
  config: {
    meta: {
      arrays: {
        weiterePersonen: {
          url: "/fluggastrechte/formular/persoenliche-daten/weitere-personen/person",
          initialInputUrl: "daten",
          statementKey: "isWeiterePersonen",
          hiddenFields: ["anrede", "title"],
          event: "add-weiterePersonen",
          shouldDisableAddButton: isTotalClaimWillSucceddedAboveLimit,
        },
      } satisfies Partial<Record<AllContextKeys, ArrayConfigServer>>,
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
      prozessfuehrung: _.merge(prozessfuehrungFlow, {
        meta: { done: prozessfuehrungDone },
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
