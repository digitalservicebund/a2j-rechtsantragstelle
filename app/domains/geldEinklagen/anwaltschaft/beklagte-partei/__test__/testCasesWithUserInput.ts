import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

const organizationInput = {
  "beklagten#orgName": "Beispiel GmbH",
  "beklagten#strasse": "Beispielstraße",
  "beklagten#hausnummer": "2",
  "beklagten#plz": "54321",
  "beklagten#ort": "Beispielstadt",
  "beklagten#land": "Deutschland",
  "beklagten#orgVertretungArt": "geschaeftsfuehrer-geschaeftsfuehrerin",
  "beklagten#orgVertretungAnrede": "herr",
  "beklagten#orgVertretungTitel": "",
  "beklagten#orgVertretungVorname": "Max",
  "beklagten#orgVertretungNachname": "Mustermann",
} as const;

const representativeInput = {
  "beklagten#gesetzliche-vertretung#anrede": "frau",
  "beklagten#gesetzliche-vertretung#titel": "",
  "beklagten#gesetzliche-vertretung#vorname": "Maria",
  "beklagten#gesetzliche-vertretung#nachname": "Musterfrau",
  "beklagten#gesetzliche-vertretung#strasse": "Musterstraße",
  "beklagten#gesetzliche-vertretung#hausnummer": "3",
  "beklagten#gesetzliche-vertretung#plz": "12345",
  "beklagten#gesetzliche-vertretung#ort": "Musterstadt",
  "beklagten#gesetzliche-vertretung#land": "Deutschland",
} as const;

export const beklagteParteiTestCases = {
  withBeklagteEinzelkanzlei: [
    {
      stepId: "/beklagte-partei/prozessbevollmaechtigte/uebersicht",
      addArrayItemEvent: "add-beklagteProzessbevollmaechtigte",
    },
    {
      stepId: "/beklagte-partei/prozessbevollmaechtigte/0/einzelkanzlei-daten",
      userInput: {
        "beklagteProzessbevollmaechtigte#name": "Einzelkanzlei Musterfrau",
        "beklagteProzessbevollmaechtigte#geschaeftszeichen": "EK-123",
        "beklagteProzessbevollmaechtigte#strasse": "Musterstraße",
        "beklagteProzessbevollmaechtigte#hausnummer": "1",
        "beklagteProzessbevollmaechtigte#plz": "12345",
        "beklagteProzessbevollmaechtigte#ort": "Musterstadt",
        "beklagteProzessbevollmaechtigte#land": "Deutschland",
        "beklagteProzessbevollmaechtigte#anrede": "frau",
        "beklagteProzessbevollmaechtigte#titel": "",
        "beklagteProzessbevollmaechtigte#vorname": "Erika",
        "beklagteProzessbevollmaechtigte#nachname": "Musterfrau",
        "beklagteProzessbevollmaechtigte#berufsbezeichnung": "Rechtsanwältin",
        "beklagteProzessbevollmaechtigte#telefonnummer": "+49 30 123456",
        "beklagteProzessbevollmaechtigte#email": "kanzlei@example.com",
      },
    },
    {
      stepId: "/beklagte-partei/prozessbevollmaechtigte/uebersicht",
    },
    {
      stepId: "/prozessantraege-prozessuale-ausfuehrungen",
    },
  ],
  withBeklagteBevollmaechtigteGesellschaft: [
    {
      stepId:
        "/beklagte-partei/prozessbevollmaechtigte/0/berufsausuebungsgesellschaft-daten",
      userInput: {
        "beklagteProzessbevollmaechtigte#name": "Musterkanzlei PartG",
        "beklagteProzessbevollmaechtigte#strasse": "Musterstraße",
        "beklagteProzessbevollmaechtigte#hausnummer": "1",
        "beklagteProzessbevollmaechtigte#plz": "12345",
        "beklagteProzessbevollmaechtigte#ort": "Musterstadt",
        "beklagteProzessbevollmaechtigte#land": "Deutschland",
        "beklagteProzessbevollmaechtigte#isProzessbevollmaechtigt": "on",
      },
    },
    {
      stepId: "/beklagte-partei/prozessbevollmaechtigte/uebersicht",
    },
  ],
  withBeklagteAddProzessbevollmaechtigtePerson: [
    {
      stepId:
        "/beklagte-partei/prozessbevollmaechtigte/0/berufsausuebungsgesellschaft-daten",
      addArrayItemEvent: "add-beklagteProzessbevollmaechtigte",
    },
    {
      stepId:
        "/beklagte-partei/prozessbevollmaechtigte/0/prozessbevollmaechtigte-personen/0/daten",
    },
  ],
  withBeklagteProzessbevollmaechtigtePerson: [
    {
      stepId:
        "/beklagte-partei/prozessbevollmaechtigte/0/prozessbevollmaechtigte-personen/0/daten",
      userInput: {
        "beklagteProzessbevollmaechtigte#prozessbevollmaechtigte-personen#anrede":
          "frau",
        "beklagteProzessbevollmaechtigte#prozessbevollmaechtigte-personen#titel":
          "",
        "beklagteProzessbevollmaechtigte#prozessbevollmaechtigte-personen#vorname":
          "Erika",
        "beklagteProzessbevollmaechtigte#prozessbevollmaechtigte-personen#nachname":
          "Musterfrau",
        "beklagteProzessbevollmaechtigte#prozessbevollmaechtigte-personen#berufsbezeichnung":
          "Rechtsanwältin",
      },
    },
    {
      stepId: "/beklagte-partei/prozessbevollmaechtigte/uebersicht",
    },
  ],
  withoutBeklagtePartei: [
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
    {
      stepId: "/beklagte-partei/prozessbevollmaechtigte/uebersicht",
    },
    {
      stepId: "/prozessantraege-prozessuale-ausfuehrungen",
    },
  ],
  withNaturalPerson: [
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
      addArrayItemEvent: "add-beklagten",
    },
    {
      stepId: "/beklagte-partei/beklagten/0/natuerliche-person-daten",
      userInput: {
        "beklagten#anrede": "frau",
        "beklagten#titel": "",
        "beklagten#vorname": "Erika",
        "beklagten#nachname": "Musterfrau",
        "beklagten#strasse": "Musterstraße",
        "beklagten#hausnummer": "1",
        "beklagten#plz": "12345",
        "beklagten#ort": "Musterstadt",
        "beklagten#land": "Deutschland",
        "beklagten#index": 1,
        "beklagten#parteiverhaeltnis": "beklagte",
        "beklagten#gesetzliche-vertretung": [],
      },
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
    {
      stepId: "/beklagte-partei/prozessbevollmaechtigte/uebersicht",
    },
    {
      stepId: "/prozessantraege-prozessuale-ausfuehrungen",
    },
  ],
  withOrganization: [
    {
      stepId: "/beklagte-partei/beklagten/0/organisation-daten",
      userInput: organizationInput,
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
  ],
  withNaturalPersonAndLegalRepresentative: [
    {
      stepId: "/beklagte-partei/beklagten/0/natuerliche-person-daten",
      addArrayItemEvent: "add-beklagten",
    },
    {
      stepId: "/beklagte-partei/beklagten/0/gesetzliche-vertretung/0/daten",
    },
  ],
  withNaturalPersonLegalRepresentativeData: [
    {
      stepId: "/beklagte-partei/beklagten/0/gesetzliche-vertretung/0/daten",
      userInput: {
        ...representativeInput,
        "beklagten#gesetzliche-vertretung#art":
          "sonstige-gesetzliche-vertretung",
      },
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
  ],
  withOrganizationAndLegalRepresentative: [
    {
      stepId: "/beklagte-partei/beklagten/0/organisation-daten",
      addArrayItemEvent: "add-beklagten",
    },
    {
      stepId:
        "/beklagte-partei/beklagten/0/gesetzliche-vertretung/0/daten-organisation",
    },
  ],
  withOrganizationLegalRepresentativeData: [
    {
      stepId:
        "/beklagte-partei/beklagten/0/gesetzliche-vertretung/0/daten-organisation",
      userInput: {
        ...representativeInput,
        "beklagten#gesetzliche-vertretung#art":
          "sonstige-gesetzliche-vertretung",
      },
    },
    {
      stepId: "/beklagte-partei/beklagten/uebersicht",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
