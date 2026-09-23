import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { fluggastrechteGuards } from "../guards";
import type { FluggastrechteFormularPages } from "../pages";

export const flugdatenFlowConfig = {
  flugdatenAdresseFluggesellschaftAuswahl: [
    {
      target: "flugdatenAdresseFluggesellschaft",
      guard: ({ fluggesellschaftAuswahlAdresse }) =>
        fluggesellschaftAuswahlAdresse === "filledByUser",
    },
    { target: "flugdatenGeplanterFlug" },
  ],
  flugdatenAdresseFluggesellschaft: "flugdatenGeplanterFlug",
  flugdatenGeplanterFlug: [
    {
      target: "flugdatenZwischenstoppUebersicht1",
      guard: ({ zwischenstoppAnzahl }) => zwischenstoppAnzahl === "oneStop",
    },
    {
      target: "flugdatenZwischenstoppUebersicht2",
      guard: ({ zwischenstoppAnzahl }) => zwischenstoppAnzahl === "twoStop",
    },
    {
      target: "flugdatenZwischenstoppUebersicht3",
      guard: ({ zwischenstoppAnzahl }) => zwischenstoppAnzahl === "threeStop",
    },
    {
      target: "flugdatenTatsaechlicherFlug",
      guard: ({ zwischenstoppAnzahl, bereich }) =>
        zwischenstoppAnzahl === "no" && bereich === "verspaetet",
    },
    {
      target: "flugdatenErsatzverbindungDaten",
      guard:
        fluggastrechteGuards.hasNoZwischenstoppAndAnnullierungWithErsatzflugYes,
    },
    {
      target: "flugdatenZusaetzlicheAngaben",
      guard:
        fluggastrechteGuards.hasNoZwischenstoppAndAnnullierungWithErsatzflugNo,
    },
    { target: "flugdatenErsatzverbindungArt" },
  ],
  flugdatenZwischenstoppUebersicht1: "flugdatenVerspaeteterFlug1",
  flugdatenZwischenstoppUebersicht2: "flugdatenVerspaeteterFlug2",
  flugdatenZwischenstoppUebersicht3: "flugdatenVerspaeteterFlug3",
  flugdatenVerspaeteterFlug1: [
    {
      target: "flugdatenAnschlussFlugVerpasst",
      guard: ({ verspaeteterFlugOneStop }) =>
        verspaeteterFlugOneStop === "startAirportFirstZwischenstopp",
    },
    {
      target: "flugdatenTatsaechlicherFlug",
      guard: ({ bereich }) => bereich === "verspaetet",
    },
    {
      target: "flugdatenErsatzverbindungDaten",
      guard: fluggastrechteGuards.hasAnnullierungWithErsatzflugYes,
    },
    {
      target: "flugdatenZusaetzlicheAngaben",
      guard: fluggastrechteGuards.hasAnnullierungWithErsatzflugNo,
    },
    { target: "flugdatenErsatzverbindungArt" },
  ],
  flugdatenVerspaeteterFlug2: [
    {
      target: "flugdatenAnschlussFlugVerpasst",
      guard: ({ verspaeteterFlugTwoStops }) =>
        verspaeteterFlugTwoStops === "startAirportFirstZwischenstopp" ||
        verspaeteterFlugTwoStops === "firstAirportSecondZwischenstopp",
    },
    {
      target: "flugdatenTatsaechlicherFlug",
      guard: ({ bereich }) => bereich === "verspaetet",
    },
    {
      target: "flugdatenErsatzverbindungDaten",
      guard: fluggastrechteGuards.hasAnnullierungWithErsatzflugYes,
    },
    {
      target: "flugdatenZusaetzlicheAngaben",
      guard: fluggastrechteGuards.hasAnnullierungWithErsatzflugNo,
    },
    { target: "flugdatenErsatzverbindungArt" },
  ],
  flugdatenVerspaeteterFlug3: [
    {
      target: "flugdatenAnschlussFlugVerpasst",
      guard: ({ verspaeteterFlugThreeStops }) =>
        verspaeteterFlugThreeStops === "startAirportFirstZwischenstopp" ||
        verspaeteterFlugThreeStops === "firstAirportSecondZwischenstopp" ||
        verspaeteterFlugThreeStops === "secondAirportThirdZwischenstopp",
    },
    {
      target: "flugdatenTatsaechlicherFlug",
      guard: ({ bereich }) => bereich === "verspaetet",
    },
    {
      target: "flugdatenErsatzverbindungDaten",
      guard: fluggastrechteGuards.hasAnnullierungWithErsatzflugYes,
    },
    {
      target: "flugdatenZusaetzlicheAngaben",
      guard: fluggastrechteGuards.hasAnnullierungWithErsatzflugNo,
    },
    { target: "flugdatenErsatzverbindungArt" },
  ],
  flugdatenAnschlussFlugVerpasst: [
    {
      target: "flugdatenTatsaechlicherFlug",
      guard: ({ bereich }) => bereich === "verspaetet",
    },
    {
      target: "flugdatenErsatzverbindungDaten",
      guard: fluggastrechteGuards.hasAnnullierungWithErsatzflugYes,
    },
    {
      target: "flugdatenZusaetzlicheAngaben",
      guard: fluggastrechteGuards.hasAnnullierungWithErsatzflugNo,
    },
    { target: "flugdatenErsatzverbindungArt" },
  ],
  flugdatenTatsaechlicherFlug: [
    {
      target: "flugdatenTatsaechlicherFlugAnkunft",
      guard: ({ tatsaechlicherFlug }) => tatsaechlicherFlug === "yes",
    },
    {
      target: "flugdatenErsatzverbindungArt",
      guard: ({ tatsaechlicherFlug }) => tatsaechlicherFlug === "no",
    },
  ],
  flugdatenTatsaechlicherFlugAnkunft: "flugdatenZusaetzlicheAngaben",
  flugdatenErsatzverbindungDaten: "flugdatenZusaetzlicheAngaben",
  flugdatenErsatzverbindungArt: [
    {
      target: "flugdatenAndererFlugAnkunft",
      guard: ({ ersatzverbindungArt }) => ersatzverbindungArt === "flug",
    },
    {
      target: "flugdatenErsatzverbindungBeschreibung",
      guard: ({ ersatzverbindungArt }) =>
        ersatzverbindungArt === "etwasAnderes",
    },
    { target: "flugdatenZusaetzlicheAngaben" },
  ],
  flugdatenAndererFlugAnkunft: "flugdatenZusaetzlicheAngaben",
  flugdatenErsatzverbindungBeschreibung: "flugdatenZusaetzlicheAngaben",
  flugdatenZusaetzlicheAngaben: [
    {
      target: "personDaten",
      guard: ({ pageData }) =>
        pageData?.subflowDoneStates?.["/flugdaten"] === true,
    },
  ],
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
