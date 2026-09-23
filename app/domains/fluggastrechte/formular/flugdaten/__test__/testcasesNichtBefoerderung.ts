import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { fluggastrechteFormularHappyPathData } from "~/domains/fluggastrechte/formular/__test__/mockTestData";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { fluggesellschaftAddresse } from "./flugdatenMock";

const baseContext = {
  ...fluggastrechteFormularHappyPathData,
  ...fluggesellschaftAddresse,
  bereich: "nichtbefoerderung",
  direktFlugnummer: "AB1234",
  buchungsNummer: "X36Q9C",
  direktAbflugsDatum: "01.05.2023",
  direktAbflugsZeit: "10:00",
  direktAnkunftsDatum: "02.05.2023",
  direktAnkunftsZeit: "10:00",
  pageData: {
    subflowDoneStates: {
      "/grundvoraussetzungen": true,
      "/flugdaten": true,
    },
  },
} satisfies Partial<FluggastrechteUserData>;

const andererFlugAnkunftInput = {
  ersatzFlugnummer: "BCA4321",
  ersatzFlugAnkunftsDatum: "10.03.2024",
  ersatzFlugAnkunftsZeit: "10:10",
  direktAnkunftsDatum: "02.05.2023",
  direktAnkunftsZeit: "10:00",
} satisfies Partial<FluggastrechteUserData>;

const ersatzverbindungBeschreibungInput = {
  andereErsatzverbindungAnkunftsDatum: "10.03.2024",
  andereErsatzverbindungAnkunftsZeit: "10:10",
  direktAnkunftsDatum: "02.05.2023",
  direktAnkunftsZeit: "10:00",
} satisfies Partial<FluggastrechteUserData>;

export const testCasesFluggastrechteFormularFlugdatenNichtBefoerderung: FlowTestCases<FluggastrechteUserData> =
  {
    keinZwischenstoppErsatzflug: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "no",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    keinZwischenstoppAndereErsatzverbindung: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "no",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "etwasAnderes",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-beschreibung",
        userInput: ersatzverbindungBeschreibungInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    keinZwischenstoppKeineAnkunft: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "no",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "keineAnkunft",
        },
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    einZwischenstoppAnschlussflugVerpasst: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "oneStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-1",
        userInput: {
          ersterZwischenstopp: "HAM",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-1",
        userInput: {
          verspaeteterFlugOneStop: "startAirportFirstZwischenstopp",
        },
      },
      {
        stepId: "/flugdaten/anschluss-flug-verpasst",
        userInput: {
          anschlussFlugVerpasst: "no",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    einZwischenstoppOhneAnschlussfrage: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "oneStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-1",
        userInput: {
          ersterZwischenstopp: "HAM",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-1",
        userInput: {
          verspaeteterFlugOneStop: "firstZwischenstoppEndAirport",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    zweiZwischenstoppsAnschlussflugVerpasst: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "twoStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-2",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "JFK",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-2",
        userInput: {
          verspaeteterFlugTwoStops: "firstAirportSecondZwischenstopp",
        },
      },
      {
        stepId: "/flugdaten/anschluss-flug-verpasst",
        userInput: {
          anschlussFlugVerpasst: "no",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    zweiZwischenstoppsOhneAnschlussfrage: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "twoStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-2",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "JFK",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-2",
        userInput: {
          verspaeteterFlugTwoStops: "secondZwischenstoppEndAirport",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    dreiZwischenstoppsAnschlussflugVerpasstErsterZwischenstopp: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "threeStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-3",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "BER",
          dritterZwischenstopp: "MUC",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-3",
        userInput: {
          verspaeteterFlugThreeStops: "startAirportFirstZwischenstopp",
        },
      },
      {
        stepId: "/flugdaten/anschluss-flug-verpasst",
        userInput: {
          anschlussFlugVerpasst: "no",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    dreiZwischenstoppsAnschlussflugVerpasstZweiterZwischenstopp: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "threeStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-3",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "BER",
          dritterZwischenstopp: "MUC",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-3",
        userInput: {
          verspaeteterFlugThreeStops: "firstAirportSecondZwischenstopp",
        },
      },
      {
        stepId: "/flugdaten/anschluss-flug-verpasst",
        userInput: {
          anschlussFlugVerpasst: "no",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    dreiZwischenstoppsAnschlussflugVerpasstDritterZwischenstopp: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "threeStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-3",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "BER",
          dritterZwischenstopp: "MUC",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-3",
        userInput: {
          verspaeteterFlugThreeStops: "secondAirportThirdZwischenstopp",
        },
      },
      {
        stepId: "/flugdaten/anschluss-flug-verpasst",
        userInput: {
          anschlussFlugVerpasst: "no",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
    dreiZwischenstoppsOhneAnschlussfrage: [
      {
        stepId: "/flugdaten/geplanter-flug",
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "threeStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-3",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "BER",
          dritterZwischenstopp: "MUC",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-3",
        userInput: {
          verspaeteterFlugThreeStops: "thirdZwischenstoppEndAirport",
        },
      },
      {
        stepId: "/flugdaten/ersatzverbindung-art",
        userInput: {
          ersatzverbindungArt: "flug",
        },
      },
      {
        stepId: "/flugdaten/anderer-flug-ankunft",
        userInput: andererFlugAnkunftInput,
      },
      {
        stepId: "/flugdaten/zusaetzliche-angaben",
        userInput: {
          zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
        },
      },
      { stepId: "/persoenliche-daten/person/daten" },
    ],
  };
