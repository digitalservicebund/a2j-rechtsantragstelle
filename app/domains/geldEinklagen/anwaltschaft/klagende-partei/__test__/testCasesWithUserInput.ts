import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

const organizationInput = {
  "klagenden#orgName": "Beispiel GmbH",
  "klagenden#strasse": "Beispielstraße",
  "klagenden#hausnummer": "2",
  "klagenden#plz": "54321",
  "klagenden#ort": "Beispielstadt",
  "klagenden#land": "Deutschland",
  "klagenden#orgVertretungArt": "geschaeftsfuehrer-geschaeftsfuehrerin",
  "klagenden#orgVertretungAnrede": "herr",
  "klagenden#orgVertretungTitel": "",
  "klagenden#orgVertretungVorname": "Max",
  "klagenden#orgVertretungNachname": "Mustermann",
} as const;

const representativeInput = {
  "klagenden#gesetzliche-vertretung#anrede": "frau",
  "klagenden#gesetzliche-vertretung#titel": "",
  "klagenden#gesetzliche-vertretung#vorname": "Maria",
  "klagenden#gesetzliche-vertretung#nachname": "Musterfrau",
  "klagenden#gesetzliche-vertretung#strasse": "Musterstraße",
  "klagenden#gesetzliche-vertretung#hausnummer": "3",
  "klagenden#gesetzliche-vertretung#plz": "12345",
  "klagenden#gesetzliche-vertretung#ort": "Musterstadt",
  "klagenden#gesetzliche-vertretung#land": "Deutschland",
} as const;

export const klagendeParteiTestCases = {
  withoutKlagendePartei: [
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
    },
    {
      stepId: "/klagende-partei/prozessbevollmaechtigte/uebersicht",
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
        "klagenden#parteiverhaeltnis": "klagende",
        "klagenden#gesetzliche-vertretung": [],
      },
    },
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
    },
    {
      stepId: "/klagende-partei/prozessbevollmaechtigte/uebersicht",
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
  ],
  withOrganization: [
    {
      stepId: "/klagende-partei/klagenden/0/organisation-daten",
      userInput: organizationInput,
    },
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
    },
  ],
  withNaturalPersonAndLegalRepresentative: [
    {
      stepId: "/klagende-partei/klagenden/0/natuerliche-person-daten",
      addArrayItemEvent: "add-klagenden",
    },
    {
      stepId: "/klagende-partei/klagenden/0/gesetzliche-vertretung/0/daten",
    },
  ],
  withNaturalPersonLegalRepresentativeData: [
    {
      stepId: "/klagende-partei/klagenden/0/gesetzliche-vertretung/0/daten",
      userInput: {
        ...representativeInput,
        "klagenden#gesetzliche-vertretung#art":
          "sonstige-gesetzliche-vertretung",
      },
    },
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
    },
  ],
  withOrganizationAndLegalRepresentative: [
    {
      stepId: "/klagende-partei/klagenden/0/organisation-daten",
      addArrayItemEvent: "add-klagenden",
    },
    {
      stepId:
        "/klagende-partei/klagenden/0/gesetzliche-vertretung/0/daten-organisation",
    },
  ],
  withOrganizationLegalRepresentativeData: [
    {
      stepId:
        "/klagende-partei/klagenden/0/gesetzliche-vertretung/0/daten-organisation",
      userInput: {
        ...representativeInput,
        "klagenden#gesetzliche-vertretung#art":
          "sonstige-gesetzliche-vertretung",
      },
    },
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
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
            type: "natuerliche-person",
            "gesetzliche-vertretung": [],
          },
          {
            strasse: "Beispielstraße",
            hausnummer: "2",
            plz: "54321",
            ort: "Beispielstadt",
            land: "Deutschland",
            parteiverhaeltnis: "klagende",
            type: "organisation",
            orgName: "Beispiel GmbH",
            orgVertretungArt: "geschaeftsfuehrer-geschaeftsfuehrerin",
            orgVertretungAnrede: "herr",
            orgVertretungTitel: "",
            orgVertretungVorname: "Max",
            orgVertretungNachname: "Mustermann",
            "gesetzliche-vertretung": [],
          },
        ],
      },
    },
    {
      stepId: "/klagende-partei/klagenden/uebersicht",
    },
    {
      stepId: "/klagende-partei/prozessbevollmaechtigte/uebersicht",
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
