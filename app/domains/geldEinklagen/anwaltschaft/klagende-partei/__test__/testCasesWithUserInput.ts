import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

export const klagendeParteiTestCases = {
  withoutKlagendePartei: [
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
  ],
  withNaturalPerson: [
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
      addArrayItemEvent: "add-klagenden",
    },
    {
      stepId: "/klagende-partei/klagenden/0/natuerliche-person-daten",
      userInput: {
        "klagenden#anrede": "frau",
        "klagenden#titel": "",
        "klagenden#vorname": "Erika",
        "klagenden#nachname": "Musterfrau",
        "klagenden#strasse": "Musterstraße",
        "klagenden#hausnummer": "1",
        "klagenden#plz": "12345",
        "klagenden#ort": "Musterstadt",
        "klagenden#land": "Deutschland",
        "klagenden#index": 1,
        "klagenden#type": "natuerliche-person",
        "klagenden#parteiverhaeltnis": "klagende",
        "klagenden#weitereVertretung": [],
      },
    },
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
  ],
  withNaturalPersonAndOrganization: [
    {
      stepId: "/voraussetzungen/intro",
    },
    {
      stepId: "/inhalt-klage",
      userInput: {
        zahlungsklageGesamtstreitwert: "1000",
      },
    },
    {
      stepId: "/pilotgericht",
      userInput: {
        pilotgericht: "steinfurt",
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
            index: 1,
            type: "natuerliche-person",
            weitereVertretung: [],
          },
          {
            strasse: "Beispielstraße",
            hausnummer: "2",
            plz: "54321",
            ort: "Beispielstadt",
            land: "Deutschland",
            parteiverhaeltnis: "klagende",
            index: 2,
            type: "organisation",
            orgName: "Beispiel GmbH",
            orgVertretungArt: "Geschäftsführer / Geschäftsführerin",
            orgVertretungAnrede: "herr",
            orgVertretungTitel: "",
            orgVertretungVorname: "Max",
            orgVertretungNachname: "Mustermann",
            weitereVertretung: [],
          },
        ],
      },
    },
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
