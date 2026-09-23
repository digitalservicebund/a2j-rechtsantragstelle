import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { fluggastrechteFormularHappyPathData } from "~/domains/fluggastrechte/formular/__test__/mockTestData";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { fluggesellschaftAddresse } from "./flugdatenMock";

const baseContext = {
  ...fluggastrechteFormularHappyPathData,
  ...fluggesellschaftAddresse,
  bereich: "verspaetet",
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

export const testCasesFluggastrechteFormularFlugdatenVerspaetet: FlowTestCases<FluggastrechteUserData> =
  {
    keinZwischenstoppTatsaechlicherFlugNeinErsatzflug: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "no",
        },
      },
      {
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
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
    keinZwischenstoppTatsaechlicherFlugNeinAndereErsatzverbindung: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "no",
        },
      },
      {
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
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
    keinZwischenstoppTatsaechlicherFlugNeinKeineAnkunft: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "no",
        },
      },
      {
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
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
    keinZwischenstoppTatsaechlicherFlugJa: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "no",
        },
      },
      {
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "yes",
        },
      },
      {
        stepId: "/flugdaten/tatsaechlicher-flug-ankunft",
        userInput: {
          tatsaechlicherAnkunftsDatum: "10.03.2024",
          tatsaechlicherAnkunftsZeit: "10:10",
          direktAnkunftsDatum: "02.05.2023",
          direktAnkunftsZeit: "10:00",
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
    einZwischenstoppAnschlussflugVerpasstJaTatsaechlicherFlugNein: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
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
          anschlussFlugVerpasst: "yes",
        },
      },
      {
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
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
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
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
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
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
    zweiZwischenstoppsStartAirportErsterZwischenstopp: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "twoStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-2",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "MUC",
          startAirport: "",
          endAirport: "",
        },
      },
      {
        stepId: "/flugdaten/verspaeteter-flug-2",
        userInput: {
          verspaeteterFlugTwoStops: "startAirportFirstZwischenstopp",
        },
      },
      {
        stepId: "/flugdaten/anschluss-flug-verpasst",
        userInput: {
          anschlussFlugVerpasst: "no",
        },
      },
      {
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
        },
      },
      { stepId: "/flugdaten/ersatzverbindung-art" },
    ],
    zweiZwischenstoppsFirstAirportSecondZwischenstopp: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "twoStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-2",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "MUC",
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
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
        },
      },
      { stepId: "/flugdaten/ersatzverbindung-art" },
    ],
    zweiZwischenstoppsSecondZwischenstoppEndAirport: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "twoStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-2",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "MUC",
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
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
        },
      },
      { stepId: "/flugdaten/ersatzverbindung-art" },
    ],
    dreiZwischenstoppsStartAirportErsterZwischenstopp: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "threeStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-3",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "MUC",
          dritterZwischenstopp: "FRA",
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
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
        },
      },
      { stepId: "/flugdaten/ersatzverbindung-art" },
    ],
    dreiZwischenstoppsFirstAirportSecondZwischenstopp: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "threeStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-3",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "MUC",
          dritterZwischenstopp: "FRA",
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
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
        },
      },
      { stepId: "/flugdaten/ersatzverbindung-art" },
    ],
    dreiZwischenstoppsSecondAirportThirdZwischenstopp: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "threeStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-3",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "MUC",
          dritterZwischenstopp: "FRA",
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
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
        },
      },
      { stepId: "/flugdaten/ersatzverbindung-art" },
    ],
    dreiZwischenstoppsThirdZwischenstoppEndAirport: [
      {
        stepId: "/flugdaten/geplanter-flug",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...baseContext,
          zwischenstoppAnzahl: "threeStop",
        },
      },
      {
        stepId: "/flugdaten/zwischenstopp-uebersicht-3",
        userInput: {
          ersterZwischenstopp: "HAM",
          zweiterZwischenstopp: "MUC",
          dritterZwischenstopp: "FRA",
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
        stepId: "/flugdaten/tatsaechlicher-flug",
        userInput: {
          tatsaechlicherFlug: "no",
        },
      },
      { stepId: "/flugdaten/ersatzverbindung-art" },
    ],
  };
