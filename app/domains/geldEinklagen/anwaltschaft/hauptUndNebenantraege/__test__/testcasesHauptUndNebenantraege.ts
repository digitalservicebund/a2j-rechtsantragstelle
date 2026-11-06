import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";

const testcaseData = {
  zahlungsklageSubjectLine: "Subject",
  zahlungsklageGesamtstreitwert: "1000",
  pilotgericht: "steinfurt",
  hauptantrag: [
    {
      internesSchlagwortFordureung: "Hauptforderung",
      betragForderung: "1000",
      beklagte: {
        "11111111-1111-4111-8111-111111111111": "on",
      },
      klagende: {
        "22222222-2222-4222-8222-222222222222": "on",
      },
      zinsbeginn: { day: "01", month: "02", year: "2003" },
      zinsende: { day: "02", month: "03", year: "2004" },
    },
  ],
  klagenden: [
    {
      anrede: "frau",
      titel: "",
      vorname: "Erika",
      nachname: "Musterfrau",
      strasse: "Musterstraße",
      hausnummer: "1",
      plz: "12345",
      ort: "Musterstadt",
      land: "Deutschland",
      parteiverhaeltnis: "klagende",
      type: "natuerliche-person",
      "gesetzliche-vertretung": [],
    },
  ],
  beklagten: [
    {
      anrede: "frau",
      titel: "",
      vorname: "Erika",
      nachname: "Musterfrau",
      strasse: "Musterstraße",
      hausnummer: "1",
      plz: "12345",
      ort: "Musterstadt",
      land: "Deutschland",
      parteiverhaeltnis: "beklagte",
      type: "natuerliche-person",
      "gesetzliche-vertretung": [],
    },
  ],
} satisfies GeldEinklagenAnwaltschaftUserData;
export const hauptUndNebenantraegeTestCases = {
  withHauptantrag: [
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht",
      addArrayItemEvent: "add-hauptantrag",
    },
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/hauptantrag/0/daten",
      userInput: {
        "hauptantrag#internesSchlagwortFordureung": "Hauptforderung",
        "hauptantrag#betragForderung": "1000",
        "hauptantrag#beklagte": {
          "11111111-1111-4111-8111-111111111111": "on",
        },
        "hauptantrag#klagende": {
          "22222222-2222-4222-8222-222222222222": "on",
        },
        "hauptantrag#zugUndZug": "off",
        "hauptantrag#beschreibungDerGegenleistung": "",
        "hauptantrag#zinssatzInProzent": 5,
        "hauptantrag#zinsmethode": "",
        "hauptantrag#zinsbeginn": { day: "01", month: "02", year: "2003" },
        "hauptantrag#zinsende": { day: "02", month: "03", year: "2004" },
      },
    },
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht",
    },
  ],

  withoutHauptantrag: [
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht",
    },
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/warnung",
    },
  ],

  withNebenantrag: [
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/0/nebenantraege/0/daten",
      userInput: {
        ...testcaseData,
        "hauptantrag#nebenantraege#type": "nebenantrag",
        "hauptantrag#nebenantraege#nebenantragArt":
          "vorgerichtlicheAnwaltskosten",
        "hauptantrag#nebenantraege#nebenantragBetrag": "100",
        "hauptantrag#nebenantraege#nebenantragZinssatzInProzent": 5,
        "hauptantrag#nebenantraege#nebenantragZinsmethode": "",
        "hauptantrag#nebenantraege#nebenantragZinsbeginn": {
          day: "01",
          month: "02",
          year: "2003",
        },
        "hauptantrag#nebenantraege#nebenantragZinsende": {
          day: "02",
          month: "03",
          year: "2004",
        },
      },
    },
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht",
    },
  ],

  withAnnahmeverzug: [
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/0/annahmeverzug/1/daten",
      userInput: {
        ...testcaseData,
        "hauptantrag#nebenantraege": [
          {
            type: "nebenantraege",
            nebenantragArt: "vorgerichtlicheAnwaltskosten",
            nebenantragBetrag: "100",
          },
        ],
        "hauptantrag#nebenantraege#type": "annahmeverzug",
        "hauptantrag#nebenantraege#annahmeverzugsFeststellung": "on",
        "hauptantrag#nebenantraege#annahmeverzugDatum": {
          day: "01",
          month: "02",
          year: "2003",
        },
      },
    },
    {
      stepId:
        "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
