import { type Config } from "~/services/flow/server/types";
import { type FluggastrechteUserData } from "../userData";
import { flugdatenDone } from "./doneFunctions";
import { hasAirlineAddress } from "../../services/airlines/hasAirlineAddress";

export const flugdatenXstateConfig = {
  meta: { done: flugdatenDone },
  id: "flugdaten",
  initial: "checkInitialPage",
  states: {
    checkInitialPage: {
      always: [
        {
          target: "adresse-fluggesellschaft-auswahl",
          guard: ({ context }) =>
            hasAirlineAddress(context.fluggesellschaft ?? ""),
        },
        {
          target: "adresse-fluggesellschaft",
        },
      ],
    },
    "adresse-fluggesellschaft-auswahl": {
      on: {
        SUBMIT: [
          {
            target: "adresse-fluggesellschaft",
            guard: ({ context }) =>
              context.fluggesellschaftAuswahlAddress === "filledByUser",
          },
          "geplanter-flug",
        ],
        BACK: "#streitwert-kosten.prozesszinsen",
      },
    },
    "adresse-fluggesellschaft": {
      on: {
        SUBMIT: "geplanter-flug",
        BACK: [
          {
            target: "#flugdaten.adresse-fluggesellschaft-auswahl",
            guard: ({ context }) =>
              context.fluggesellschaftAuswahlAddress === "filledByUser",
          },
          "#streitwert-kosten.prozesszinsen",
        ],
      },
    },
    "geplanter-flug": {
      on: {
        SUBMIT: [
          {
            target: "zwischenstopp-uebersicht-1",
            guard: "hasOneStop",
          },
          {
            target: "zwischenstopp-uebersicht-2",
            guard: "hasTwoStop",
          },
          {
            target: "zwischenstopp-uebersicht-3",
            guard: "hasThreeStop",
          },
          {
            target: "tatsaechlicher-flug",
            guard: "hasNoZwischenstoppAndVerspaetung",
          },
          {
            target: "ersatzverbindung-daten",
            guard: "hasNoZwischenstoppAndAnnullierungWithErsatzflugYes",
          },
          {
            target: "zusaetzliche-angaben",
            guard: "hasNoZwischenstoppAndAnnullierungWithErsatzflugNo",
          },
          "ersatzverbindung-art",
        ],
        BACK: [
          {
            target: "#flugdaten.adresse-fluggesellschaft-auswahl",
            guard: ({ context }) =>
              context.fluggesellschaftAuswahlAddress === "fromAirlineDB",
          },
          "#flugdaten.adresse-fluggesellschaft",
        ],
      },
    },
    "zwischenstopp-uebersicht-1": {
      on: {
        SUBMIT: "verspaeteter-flug-1",
        BACK: "geplanter-flug",
      },
    },
    "verspaeteter-flug-1": {
      on: {
        SUBMIT: [
          {
            target: "anschluss-flug-verpasst",
            guard: "hasVerspaeteterFlugStartAirportFirstZwischenstopp",
          },
          {
            target: "tatsaechlicher-flug",
            guard: "hasVerspaetung",
          },
          {
            target: "ersatzverbindung-daten",
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: "zusaetzliche-angaben",
            guard: "hasAnnullierungWithErsatzflugNo",
          },
          "ersatzverbindung-art",
        ],
        BACK: "zwischenstopp-uebersicht-1",
      },
    },
    "zwischenstopp-uebersicht-2": {
      on: {
        SUBMIT: "verspaeteter-flug-2",
        BACK: "geplanter-flug",
      },
    },
    "verspaeteter-flug-2": {
      on: {
        SUBMIT: [
          {
            target: "anschluss-flug-verpasst",
            guard: "hasVerspaeteterFlugStartAirportFirstZwischenstopp",
          },
          {
            target: "anschluss-flug-verpasst",
            guard: "hasVerspaeteterFlugFirstAirportSecondZwischenstopp",
          },
          {
            target: "tatsaechlicher-flug",
            guard: "hasVerspaetung",
          },
          {
            target: "ersatzverbindung-daten",
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: "zusaetzliche-angaben",
            guard: "hasAnnullierungWithErsatzflugNo",
          },
          "ersatzverbindung-art",
        ],
        BACK: "zwischenstopp-uebersicht-2",
      },
    },
    "zwischenstopp-uebersicht-3": {
      on: {
        SUBMIT: "verspaeteter-flug-3",
        BACK: "geplanter-flug",
      },
    },
    "verspaeteter-flug-3": {
      on: {
        SUBMIT: [
          {
            target: "anschluss-flug-verpasst",
            guard: "hasVerspaeteterFlugStartAirportFirstZwischenstopp",
          },
          {
            target: "anschluss-flug-verpasst",
            guard: "hasVerspaeteterFlugFirstAirportSecondZwischenstopp",
          },
          {
            target: "anschluss-flug-verpasst",
            guard: "hasVerspaeteterFlugSecondAirportThirdZwischenstopp",
          },
          {
            target: "tatsaechlicher-flug",
            guard: "hasVerspaetung",
          },
          {
            target: "ersatzverbindung-daten",
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: "zusaetzliche-angaben",
            guard: "hasAnnullierungWithErsatzflugNo",
          },
          "ersatzverbindung-art",
        ],
        BACK: "zwischenstopp-uebersicht-3",
      },
    },
    "anschluss-flug-verpasst": {
      on: {
        SUBMIT: [
          {
            target: "tatsaechlicher-flug",
            guard: "hasVerspaetung",
          },
          {
            target: "ersatzverbindung-daten",
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: "zusaetzliche-angaben",
            guard: "hasAnnullierungWithErsatzflugNo",
          },
          "ersatzverbindung-art",
        ],
        BACK: [
          {
            target: "verspaeteter-flug-1",
            guard: "hasOneStop",
          },
          {
            target: "verspaeteter-flug-2",
            guard: "hasTwoStop",
          },
          "verspaeteter-flug-3",
        ],
      },
    },
    "tatsaechlicher-flug": {
      on: {
        SUBMIT: [
          {
            target: "tatsaechlicher-flug-ankunft",
            guard: "tatsaechlicherFlugYes",
          },
          {
            target: "ersatzverbindung-art",
            guard: "tatsaechlicherFlugNo",
          },
        ],
        BACK: [
          {
            target: "anschluss-flug-verpasst",
            guard: "hasVerspaeteterFlugNonEndAirport",
          },
          {
            target: "verspaeteter-flug-1",
            guard: "hasOneStop",
          },
          {
            target: "verspaeteter-flug-2",
            guard: "hasTwoStop",
          },
          {
            target: "verspaeteter-flug-3",
            guard: "hasThreeStop",
          },
          "geplanter-flug",
        ],
      },
    },
    "tatsaechlicher-flug-ankunft": {
      on: {
        SUBMIT: "zusaetzliche-angaben",
        BACK: "tatsaechlicher-flug",
      },
    },
    "ersatzverbindung-daten": {
      on: {
        SUBMIT: "zusaetzliche-angaben",
        BACK: [
          {
            target: "anschluss-flug-verpasst",
            guard: "hasVerspaeteterFlugNonEndAirport",
          },
          {
            target: "verspaeteter-flug-1",
            guard: "hasOneStop",
          },
          {
            target: "verspaeteter-flug-2",
            guard: "hasTwoStop",
          },
          {
            target: "verspaeteter-flug-3",
            guard: "hasThreeStop",
          },
          "geplanter-flug",
        ],
      },
    },
    "ersatzverbindung-art": {
      on: {
        SUBMIT: [
          {
            target: "anderer-flug-ankunft",
            guard: "hasErsatzVerbindungFlug",
          },
          {
            target: "ersatzverbindung-beschreibung",
            guard: "hasAndereErsatzVerbindung",
          },
          "zusaetzliche-angaben",
        ],
        BACK: [
          {
            target: "anschluss-flug-verpasst",
            guard:
              "hasBereichNichtBefoerderungAndVerspaeteterFlugNonEndAirport",
          },
          {
            target: "verspaeteter-flug-1",
            guard: "hasOneStopWithNichtBefoerderung",
          },
          {
            target: "verspaeteter-flug-2",
            guard: "hasTwoStopWithNichtBefoerderung",
          },
          {
            target: "verspaeteter-flug-3",
            guard: "hasThreeStopWithNichtBefoerderung",
          },
          {
            target: "geplanter-flug",
            guard: "hasNoZwischenstoppWithNichtBefoerderung",
          },
          "tatsaechlicher-flug",
        ],
      },
    },
    "anderer-flug-ankunft": {
      on: {
        SUBMIT: "zusaetzliche-angaben",
        BACK: "ersatzverbindung-art",
      },
    },
    "ersatzverbindung-beschreibung": {
      on: {
        SUBMIT: "zusaetzliche-angaben",
        BACK: "ersatzverbindung-art",
      },
    },
    "zusaetzliche-angaben": {
      on: {
        SUBMIT: [
          {
            target: "#persoenliche-daten.person.daten",
            guard: "flugdatenDone",
          },
        ],
        BACK: [
          {
            target: "tatsaechlicher-flug-ankunft",
            guard: "hasDetailedTatsaechlicherFlugAnkunft",
          },
          {
            target: "ersatzverbindung-daten",
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: "geplanter-flug",
            guard: "hasNoZwischenstoppAndAnnullierungWithErsatzflugNo",
          },
          {
            target: "anschluss-flug-verpasst",
            guard:
              "hasVerspaeteterFlugNonEndAirportAndAnnullierungWithErsatzflugNo",
          },
          {
            target: "verspaeteter-flug-1",
            guard: "hasOneStopWithAnnullierungWithErsatzflugNo",
          },
          {
            target: "verspaeteter-flug-2",
            guard: "hasTwoStopWithAnnullierungWithErsatzflugNo",
          },
          {
            target: "verspaeteter-flug-3",
            guard: "hasThreeStopWithAnnullierungWithErsatzflugNo",
          },
          {
            target: "anderer-flug-ankunft",
            guard: "hasDetailedErsatzVerbindungFlug",
          },
          {
            target: "ersatzverbindung-beschreibung",
            guard: "hasAndereErsatzVerbindung",
          },
          "ersatzverbindung-art",
        ],
      },
    },
  },
} satisfies Config<FluggastrechteUserData>;
