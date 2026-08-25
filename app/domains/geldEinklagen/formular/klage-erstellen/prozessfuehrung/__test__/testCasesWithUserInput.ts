import type { ExpectedStep, FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

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
  beklagteStrasse: "beklagteStrasse",
  beklagteHausnummer: "1",
  beklagtePlz: ZIP_CODE_PILOT_COURT,
  beklagteOrt: "beklagteOrt",
  klagendePersonAnrede: "none",
  klagendePersonTitle: "none",
  klagendePersonVorname: "klagendePersonVorname",
  klagendePersonNachname: "klagendePersonNachname",
  klagendePersonStrasse: "klagendePersonStrasse",
  klagendePersonHausnummer: "1",
  klagendePersonPlz: ZIP_CODE_PILOT_COURT,
  klagendePersonOrt: "klagendePersonOrt",
  beklagteAnrede: "none",
  beklagteTitle: "none",
  beklagteVorname: "beklagteVorname",
  beklagteNachname: "beklagteNachname",
  sachverhaltBegruendung: "some reason",
  beweiseAngebot: "no",
  forderungGesamtbetrag: "1000",
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
      "/klage-erstellen/prozessfuehrung": true,
    },
  },
};

const lastDefaultStep = (): Array<
  ExpectedStep<GeldEinklagenFormularUserData>
> => [
  {
    stepId: "/klage-erstellen/prozessfuehrung/muendliche-verhandlung",
    userInput: {
      muendlicheVerhandlung: "yes",
    },
  },
  {
    stepId: "/klage-erstellen/prozessfuehrung/videoverhandlung",
    userInput: {
      videoVerhandlung: "no",
    },
  },
  {
    stepId: "/klage-erstellen/prozessfuehrung/versaeumnisurteil",
    userInput: {
      versaeumnisurteil: "yes",
    },
  },
  {
    stepId: "/klage-erstellen/prozessfuehrung/zahlung-nach-klageeinreichung",
  },
  {
    stepId: "/klage-erstellen/rechtlicher-zusatz/weitere-antraege",
  },
];

export const testCasesWithUserInputKlagenErstellenProzessfuehrung: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    klagenErstellenProzessfuehrungStreitbeilegungYes: [
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
        userInput: {
          ...baseContext,
          anwaltskosten: "10",
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/prozesszinsen",
        userInput: {
          prozesszinsen: "yes",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/streitbeilegung",
        userInput: {
          streitbeilegung: "yes",
        },
      },
      ...lastDefaultStep(),
    ],
    klagenErstellenProzessfuehrungStreitbeilegungNo: [
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
        userInput: {
          ...baseContext,
          anwaltskosten: "10",
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/prozesszinsen",
        userInput: {
          prozesszinsen: "yes",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/streitbeilegung",
        userInput: {
          streitbeilegung: "no",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/streitbeilegung-gruende",
        userInput: {
          streitbeilegungGruende: "yes",
        },
      },
      ...lastDefaultStep(),
    ],
    klagenErstellenProzessfuehrungStreitbeilegungNoSpecification: [
      {
        stepId: "/klage-erstellen/prozessfuehrung/anwaltskosten",
        userInput: {
          ...baseContext,
          anwaltskosten: "10",
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/prozesszinsen",
        userInput: {
          prozesszinsen: "yes",
        },
      },
      {
        stepId: "/klage-erstellen/prozessfuehrung/streitbeilegung",
        userInput: {
          streitbeilegung: "noSpecification",
        },
      },
      ...lastDefaultStep(),
    ],
  };
