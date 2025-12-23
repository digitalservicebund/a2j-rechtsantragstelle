import { type Config } from "~/services/flow/server/types";
import { type FluggastrechteUserData } from "../userData";
import { flugdatenDone } from "./doneFunctions";
import { hasAirlineAddress } from "../../services/airlines/hasAirlineAddress";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { fluggastrechteFormularPages } from "../pages";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const flugdatenXstateConfig = {
  id: "flugdaten",
  initial: "check-initial-page",
  states: {
    "check-initial-page": {
      always: [
        {
          target: steps.flugdatenAdresseFluggesellschaftAuswahl.relative,
          guard: ({ context }) =>
            hasAirlineAddress(context.fluggesellschaft ?? ""),
        },
        {
          target: steps.flugdatenAdresseFluggesellschaft.relative,
        },
      ],
    },
    [steps.flugdatenAdresseFluggesellschaftAuswahl.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.flugdatenAdresseFluggesellschaft.relative,
            guard: ({ context }) =>
              context.fluggesellschaftAuswahlAdresse === "filledByUser",
          },
          steps.flugdatenGeplanterFlug.relative,
        ],
        BACK: steps.streitwertKostenProzesszinsen.absolute,
      },
    },
    [steps.flugdatenAdresseFluggesellschaft.relative]: {
      on: {
        SUBMIT: steps.flugdatenGeplanterFlug.relative,
        BACK: [
          {
            target: steps.flugdatenAdresseFluggesellschaftAuswahl.relative,
            guard: ({ context }) =>
              context.fluggesellschaftAuswahlAdresse === "filledByUser",
          },
          steps.streitwertKostenProzesszinsen.absolute,
        ],
      },
    },
    [steps.flugdatenGeplanterFlug.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.flugdatenZwischenstoppUebersicht1.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "oneStop",
          },
          {
            target: steps.flugdatenZwischenstoppUebersicht2.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "twoStop",
          },
          {
            target: steps.flugdatenZwischenstoppUebersicht3.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "threeStop",
          },
          {
            target: steps.flugdatenTatsaechlicherFlug.relative,
            guard: "hasNoZwischenstoppAndVerspaetung",
          },
          {
            target: steps.flugdatenErsatzverbindungDaten.relative,
            guard: "hasNoZwischenstoppAndAnnullierungWithErsatzflugYes",
          },
          {
            target: steps.flugdatenZusaetzlicheAngaben.relative,
            guard: "hasNoZwischenstoppAndAnnullierungWithErsatzflugNo",
          },
          steps.flugdatenErsatzverbindungArt.relative,
        ],
        BACK: [
          {
            target: steps.flugdatenAdresseFluggesellschaftAuswahl.relative,
            guard: ({ context }) =>
              context.fluggesellschaftAuswahlAdresse === "fromAirlineDB",
          },
          steps.flugdatenAdresseFluggesellschaft.relative,
        ],
      },
    },
    [steps.flugdatenZwischenstoppUebersicht1.relative]: {
      on: {
        SUBMIT: steps.flugdatenVerspaeteterFlug1.relative,
        BACK: steps.flugdatenGeplanterFlug.relative,
      },
    },
    [steps.flugdatenVerspaeteterFlug1.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard: ({ context }) =>
              context.verspaeteterFlugOneStop ===
              "startAirportFirstZwischenstopp",
          },
          {
            target: steps.flugdatenTatsaechlicherFlug.relative,
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          {
            target: steps.flugdatenErsatzverbindungDaten.relative,
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: steps.flugdatenZusaetzlicheAngaben.relative,
            guard: "hasAnnullierungWithErsatzflugNo",
          },
          steps.flugdatenErsatzverbindungArt.relative,
        ],
        BACK: steps.flugdatenZwischenstoppUebersicht1.relative,
      },
    },
    [steps.flugdatenZwischenstoppUebersicht2.relative]: {
      on: {
        SUBMIT: steps.flugdatenVerspaeteterFlug2.relative,
        BACK: steps.flugdatenGeplanterFlug.relative,
      },
    },
    [steps.flugdatenVerspaeteterFlug2.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard: ({ context }) =>
              context.verspaeteterFlugTwoStops ===
              "startAirportFirstZwischenstopp",
          },
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard: ({ context }) =>
              context.verspaeteterFlugTwoStops ===
              "firstAirportSecondZwischenstopp",
          },
          {
            target: steps.flugdatenTatsaechlicherFlug.relative,
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          {
            target: steps.flugdatenErsatzverbindungDaten.relative,
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: steps.flugdatenZusaetzlicheAngaben.relative,
            guard: "hasAnnullierungWithErsatzflugNo",
          },
          steps.flugdatenErsatzverbindungArt.relative,
        ],
        BACK: steps.flugdatenZwischenstoppUebersicht2.relative,
      },
    },
    [steps.flugdatenZwischenstoppUebersicht3.relative]: {
      on: {
        SUBMIT: steps.flugdatenVerspaeteterFlug3.relative,
        BACK: steps.flugdatenGeplanterFlug.relative,
      },
    },
    [steps.flugdatenVerspaeteterFlug3.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard: ({ context }) =>
              context.verspaeteterFlugThreeStops ===
              "startAirportFirstZwischenstopp",
          },
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard: ({ context }) =>
              context.verspaeteterFlugThreeStops ===
              "firstAirportSecondZwischenstopp",
          },
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard: ({ context }) =>
              context.verspaeteterFlugThreeStops ===
              "secondAirportThirdZwischenstopp",
          },
          {
            target: steps.flugdatenTatsaechlicherFlug.relative,
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          {
            target: steps.flugdatenErsatzverbindungDaten.relative,
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: steps.flugdatenZusaetzlicheAngaben.relative,
            guard: "hasAnnullierungWithErsatzflugNo",
          },
          steps.flugdatenErsatzverbindungArt.relative,
        ],
        BACK: steps.flugdatenZwischenstoppUebersicht3.relative,
      },
    },
    [steps.flugdatenAnschlussFlugVerpasst.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.flugdatenTatsaechlicherFlug.relative,
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          {
            target: steps.flugdatenErsatzverbindungDaten.relative,
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: steps.flugdatenZusaetzlicheAngaben.relative,
            guard: "hasAnnullierungWithErsatzflugNo",
          },
          steps.flugdatenErsatzverbindungArt.relative,
        ],
        BACK: [
          {
            target: steps.flugdatenVerspaeteterFlug1.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "oneStop",
          },
          {
            target: steps.flugdatenVerspaeteterFlug2.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "twoStop",
          },
          steps.flugdatenVerspaeteterFlug3.relative,
        ],
      },
    },
    [steps.flugdatenTatsaechlicherFlug.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.flugdatenTatsaechlicherFlugAnkunft.relative,
            guard: ({ context }) => context.tatsaechlicherFlug === "yes",
          },
          {
            target: steps.flugdatenErsatzverbindungArt.relative,
            guard: ({ context }) => context.tatsaechlicherFlug === "no",
          },
        ],
        BACK: [
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard: "hasVerspaeteterFlugNonEndAirport",
          },
          {
            target: steps.flugdatenVerspaeteterFlug1.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "oneStop",
          },
          {
            target: steps.flugdatenVerspaeteterFlug2.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "twoStop",
          },
          {
            target: steps.flugdatenVerspaeteterFlug3.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "threeStop",
          },
          steps.flugdatenGeplanterFlug.relative,
        ],
      },
    },
    [steps.flugdatenTatsaechlicherFlugAnkunft.relative]: {
      on: {
        SUBMIT: steps.flugdatenZusaetzlicheAngaben.relative,
        BACK: steps.flugdatenTatsaechlicherFlug.relative,
      },
    },
    [steps.flugdatenErsatzverbindungDaten.relative]: {
      on: {
        SUBMIT: steps.flugdatenZusaetzlicheAngaben.relative,
        BACK: [
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard: "hasVerspaeteterFlugNonEndAirport",
          },
          {
            target: steps.flugdatenVerspaeteterFlug1.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "oneStop",
          },
          {
            target: steps.flugdatenVerspaeteterFlug2.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "twoStop",
          },
          {
            target: steps.flugdatenVerspaeteterFlug3.relative,
            guard: ({ context }) => context.zwischenstoppAnzahl === "threeStop",
          },
          steps.flugdatenGeplanterFlug.relative,
        ],
      },
    },
    [steps.flugdatenErsatzverbindungArt.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.flugdatenAndererFlugAnkunft.relative,
            guard: ({ context }) => context.ersatzverbindungArt === "flug",
          },
          {
            target: steps.flugdatenErsatzverbindungBeschreibung.relative,
            guard: ({ context }) =>
              context.ersatzverbindungArt === "etwasAnderes",
          },
          steps.flugdatenZusaetzlicheAngaben.relative,
        ],
        BACK: [
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard:
              "hasBereichNichtBefoerderungAndVerspaeteterFlugNonEndAirport",
          },
          {
            target: steps.flugdatenVerspaeteterFlug1.relative,
            guard: "hasOneStopWithNichtBefoerderung",
          },
          {
            target: steps.flugdatenVerspaeteterFlug2.relative,
            guard: "hasTwoStopWithNichtBefoerderung",
          },
          {
            target: steps.flugdatenVerspaeteterFlug3.relative,
            guard: "hasThreeStopWithNichtBefoerderung",
          },
          {
            target: steps.flugdatenGeplanterFlug.relative,
            guard: "hasNoZwischenstoppWithNichtBefoerderung",
          },
          steps.flugdatenTatsaechlicherFlug.relative,
        ],
      },
    },
    [steps.flugdatenAndererFlugAnkunft.relative]: {
      on: {
        SUBMIT: steps.flugdatenZusaetzlicheAngaben.relative,
        BACK: steps.flugdatenErsatzverbindungArt.relative,
      },
    },
    [steps.flugdatenErsatzverbindungBeschreibung.relative]: {
      on: {
        SUBMIT: steps.flugdatenZusaetzlicheAngaben.relative,
        BACK: steps.flugdatenErsatzverbindungArt.relative,
      },
    },
    [steps.flugdatenZusaetzlicheAngaben.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.personDaten.absolute,
            guard: flugdatenDone,
          },
        ],
        BACK: [
          {
            target: steps.flugdatenTatsaechlicherFlugAnkunft.relative,
            guard: "hasDetailedTatsaechlicherFlugAnkunft",
          },
          {
            target: steps.flugdatenErsatzverbindungDaten.relative,
            guard: "hasAnnullierungWithErsatzflugYes",
          },
          {
            target: steps.flugdatenGeplanterFlug.relative,
            guard: "hasNoZwischenstoppAndAnnullierungWithErsatzflugNo",
          },
          {
            target: steps.flugdatenAnschlussFlugVerpasst.relative,
            guard:
              "hasVerspaeteterFlugNonEndAirportAndAnnullierungWithErsatzflugNo",
          },
          {
            target: steps.flugdatenVerspaeteterFlug1.relative,
            guard: "hasOneStopWithAnnullierungWithErsatzflugNo",
          },
          {
            target: steps.flugdatenVerspaeteterFlug2.relative,
            guard: "hasTwoStopWithAnnullierungWithErsatzflugNo",
          },
          {
            target: steps.flugdatenVerspaeteterFlug3.relative,
            guard: "hasThreeStopWithAnnullierungWithErsatzflugNo",
          },
          {
            target: steps.flugdatenAndererFlugAnkunft.relative,
            guard: "hasDetailedErsatzVerbindungFlug",
          },
          {
            target: steps.flugdatenErsatzverbindungBeschreibung.relative,
            guard: ({ context }) =>
              context.ersatzverbindungArt === "etwasAnderes",
          },
          steps.flugdatenErsatzverbindungArt.relative,
        ],
      },
    },
  },
} satisfies Config<FluggastrechteUserData>;
