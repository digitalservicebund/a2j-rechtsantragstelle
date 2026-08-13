import type { ExpectedStep, FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

const ZIP_CODE_PILOT_COURT = "10823";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  gegenWenBeklagen: "person",
  mietePachtVertrag: "yes",
  mietePachtRaum: "yes",
  postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
  forderungGesamtbetrag: "100.00",
  sachverhaltBegruendung: "some reason",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/sachgebiet": true,
      "/gericht-pruefen/klagende-person": true,
      "/gericht-pruefen/beklagte-person": true,
      "/gericht-pruefen/gericht-suchen": true,
      "/klage-erstellen/klagende-person": true,
      "/klage-erstellen/beklagte-person": true,
      "/klage-erstellen/forderung": true,
      "/klage-erstellen/sachverhalt": true,
    },
  },
};

const baseContextKlagendePerson: GeldEinklagenFormularUserData = {
  klagendePersonAnrede: "none",
  klagendePersonTitle: "none",
  klagendePersonVorname: "klagendePersonVorname",
  klagendePersonNachname: "klagendePersonNachname",
  klagendePersonStrasse: "klagendePersonStrasse",
  klagendePersonHausnummer: "1",
  klagendePersonPlz: ZIP_CODE_PILOT_COURT,
  klagendePersonOrt: "klagendePersonOrt",
  klagendeTelefonnummer: "",
  klagendeEmail: "",
  klagendePersonIban: "",
};

const initialDefaultStep = (
  userInputStepData?: GeldEinklagenFormularUserData,
): Array<ExpectedStep<GeldEinklagenFormularUserData>> => [
  {
    stepId: "/klage-erstellen/intro/start",
    userInput: {
      ...baseContext,
      ...userInputStepData,
    },
    skipPageSchemaValidation: true,
  },
  {
    stepId: "/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
  },
  {
    stepId: "/klage-erstellen/streitwert-kosten/weitere-kosten",
  },
];

export const testCasesWithUserInputKlagenErstellen: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    klageErstelleBeklagteMenschenAndNoAnwaltschaft: [
      ...initialDefaultStep(),
      {
        stepId: "/klage-erstellen/klagende-person/kontaktdaten",
        userInput: {
          ...baseContextKlagendePerson,
        },
      },
      {
        stepId: "/klage-erstellen/beklagte-person/mensch",
        userInput: {
          beklagteAnrede: "none",
          beklagteTitle: "none",
          beklagteVorname: "beklagteVorname",
          beklagteNachname: "beklagteNachname",
          beklagteStrasse: "beklagteStrasse",
          beklagteHausnummer: "1",
          beklagtePlz: ZIP_CODE_PILOT_COURT,
          beklagteOrt: "beklagteOrt",
        },
      },
      {
        stepId: "/klage-erstellen/forderung/gesamtbetrag",
      },
      {
        stepId: "/klage-erstellen/sachverhalt/begruendung",
        userInput: {
          sachverhaltBegruendung: "some reason",
        },
      },
      {
        stepId: "/klage-erstellen/beweise/angebot",
        userInput: {
          beweiseAngebot: "yes",
        },
      },
      {
        stepId: "/klage-erstellen/beweise/beschreibung",
        userInput: {
          beweiseBeschreibung: "some description",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/prozesszinsen",
      },
    ],
    klageErstelleBeklagteOrganisationAndNoAnwaltschaft: [
      ...initialDefaultStep({
        gegenWenBeklagen: "organisation",
      }),
      {
        stepId: "/klage-erstellen/klagende-person/kontaktdaten",
        userInput: {
          ...baseContextKlagendePerson,
        },
      },
      {
        stepId: "/klage-erstellen/beklagte-person/organisation",
        userInput: {
          beklagteNameOrganisation: "beklagteNameOrganisation",
          beklagteGesetzlichenVertretungVorname:
            "beklagteGesetzlichenVertretungVorname",
          beklagteGesetzlichenVertretungNachname:
            "beklagteGesetzlichenVertretungNachname",
          beklagteGesetzlichenVertretungAnrede: "herr",
          beklagteGesetzlichenVertretungTitle: "dr",
          beklagteStrasse: "beklagteStrasse",
          beklagteHausnummer: "1",
          beklagtePlz: ZIP_CODE_PILOT_COURT,
          beklagteOrt: "beklagteOrt",
        },
      },
      {
        stepId: "/klage-erstellen/forderung/gesamtbetrag",
      },
      {
        stepId: "/klage-erstellen/sachverhalt/begruendung",
        userInput: {
          sachverhaltBegruendung: "some reason",
        },
      },
      {
        stepId: "/klage-erstellen/beweise/angebot",
        userInput: {
          beweiseAngebot: "yes",
        },
      },
      {
        stepId: "/klage-erstellen/beweise/beschreibung",
        userInput: {
          beweiseBeschreibung: "some description",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/prozesszinsen",
      },
    ],
    klageErstelleBeklagteMenschenAndNoAnwaltschaftAndNoBeweiseAngebot: [
      ...initialDefaultStep(),
      {
        stepId: "/klage-erstellen/klagende-person/kontaktdaten",
        userInput: {
          ...baseContextKlagendePerson,
        },
      },
      {
        stepId: "/klage-erstellen/beklagte-person/mensch",
        userInput: {
          beklagteAnrede: "none",
          beklagteTitle: "none",
          beklagteVorname: "beklagteVorname",
          beklagteNachname: "beklagteNachname",
          beklagteStrasse: "beklagteStrasse",
          beklagteHausnummer: "1",
          beklagtePlz: ZIP_CODE_PILOT_COURT,
          beklagteOrt: "beklagteOrt",
        },
      },
      {
        stepId: "/klage-erstellen/forderung/gesamtbetrag",
      },
      {
        stepId: "/klage-erstellen/sachverhalt/begruendung",
        userInput: {
          sachverhaltBegruendung: "some reason",
        },
      },
      {
        stepId: "/klage-erstellen/beweise/angebot",
        userInput: {
          beweiseAngebot: "no",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/prozesszinsen",
      },
    ],
    klageErstelleBeklagteOrganisationAndNoAnwaltschaftAndNoBeweiseAngebot: [
      ...initialDefaultStep({
        gegenWenBeklagen: "organisation",
      }),
      {
        stepId: "/klage-erstellen/klagende-person/kontaktdaten",
        userInput: {
          ...baseContextKlagendePerson,
        },
      },
      {
        stepId: "/klage-erstellen/beklagte-person/organisation",
        userInput: {
          beklagteNameOrganisation: "beklagteNameOrganisation",
          beklagteGesetzlichenVertretungVorname:
            "beklagteGesetzlichenVertretungVorname",
          beklagteGesetzlichenVertretungNachname:
            "beklagteGesetzlichenVertretungNachname",
          beklagteGesetzlichenVertretungAnrede: "herr",
          beklagteGesetzlichenVertretungTitle: "dr",
          beklagteStrasse: "beklagteStrasse",
          beklagteHausnummer: "1",
          beklagtePlz: ZIP_CODE_PILOT_COURT,
          beklagteOrt: "beklagteOrt",
        },
      },
      {
        stepId: "/klage-erstellen/forderung/gesamtbetrag",
      },
      {
        stepId: "/klage-erstellen/sachverhalt/begruendung",
        userInput: {
          sachverhaltBegruendung: "some reason",
        },
      },
      {
        stepId: "/klage-erstellen/beweise/angebot",
        userInput: {
          beweiseAngebot: "no",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/prozesszinsen",
      },
    ],
    klageErstelleBeklagteOrganisationAndAnwaltschaftYes: [
      ...initialDefaultStep({
        anwaltschaft: "yes",
        gegenWenBeklagen: "organisation",
      }),
      {
        stepId: "/klage-erstellen/klagende-person/kontaktdaten-anwaltschaft",
        userInput: {
          klagendePersonAnwaltschaftStrasse:
            "klagendePersonAnwaltschaftStrasse",
          klagendePersonAnwaltschaftHausnummer: "1",
          klagendePersonAnwaltschaftPlz: ZIP_CODE_PILOT_COURT,
          klagendePersonAnwaltschaftOrt: "klagendePersonAnwaltschaftOrt",
          klagendePersonAnwaltschaftAnrede: "none",
          klagendePersonAnwaltschaftVorname:
            "klagendePersonAnwaltschaftVorname",
          klagendePersonAnwaltschaftNachname:
            "klagendePersonAnwaltschaftNachname",
          klagendePersonAnwaltschaftTitle: "none",
          klagendePersonAnwaltschaftEmail: "",
          klagendePersonAnwaltschaftTelefonnummer: "",
        },
      },
      {
        stepId: "/klage-erstellen/klagende-person/kontaktdaten",
        userInput: {
          ...baseContextKlagendePerson,
        },
      },
      {
        stepId: "/klage-erstellen/beklagte-person/organisation",
        userInput: {
          beklagteNameOrganisation: "beklagteNameOrganisation",
          beklagteGesetzlichenVertretungVorname:
            "beklagteGesetzlichenVertretungVorname",
          beklagteGesetzlichenVertretungNachname:
            "beklagteGesetzlichenVertretungNachname",
          beklagteGesetzlichenVertretungAnrede: "herr",
          beklagteGesetzlichenVertretungTitle: "dr",
          beklagteStrasse: "beklagteStrasse",
          beklagteHausnummer: "1",
          beklagtePlz: ZIP_CODE_PILOT_COURT,
          beklagteOrt: "beklagteOrt",
        },
      },
      {
        stepId: "/klage-erstellen/forderung/gesamtbetrag",
      },
      {
        stepId: "/klage-erstellen/sachverhalt/begruendung",
        userInput: {
          sachverhaltBegruendung: "some reason",
        },
      },
      {
        stepId: "/klage-erstellen/beweise/angebot",
        userInput: {
          beweiseAngebot: "no",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/prozesszinsen",
      },
    ],
  };
