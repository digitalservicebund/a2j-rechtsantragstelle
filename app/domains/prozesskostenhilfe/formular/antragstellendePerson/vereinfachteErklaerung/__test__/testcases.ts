import { type FlowTestCases } from "~/domains/__test__/TestCases";

const frageVermoegenFulfilled = {
  frageVermoegenFulfilledUnterhalt: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        minderjaehrig: "yes",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
      userInput: {
        child: {
          geburtsdatum: "10.10.2005",
        },
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
      userInput: {
        unterhaltsOrAbstammungssachen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
      userInput: {
        rechtlichesThema: "unterhalt",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
    },
  ],
  frageVermoegenFulfilledVollstreckung: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        minderjaehrig: "yes",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
      userInput: {
        child: {
          geburtsdatum: "10.10.2005",
        },
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
      userInput: {
        unterhaltsOrAbstammungssachen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
      userInput: {
        rechtlichesThema: "vollstreckung",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
    },
  ],
  frageVermoegenFulfilledAbstammung: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        minderjaehrig: "yes",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
      userInput: {
        child: {
          geburtsdatum: "10.10.2005",
        },
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
      userInput: {
        unterhaltsOrAbstammungssachen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
      userInput: {
        rechtlichesThema: "abstammung",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
    },
  ],
  frageVermoegenFulfilledEinkommen: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        minderjaehrig: "yes",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
      userInput: {
        child: {
          geburtsdatum: "10.10.2005",
        },
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
      userInput: {
        unterhaltsOrAbstammungssachen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
      userInput: {
        rechtlichesThema: "unterhalt",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
      userInput: {
        hasEinnahmen: "yes",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen-value",
      userInput: {
        hohesEinkommen: "no",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen-uebersicht",
      addArrayItemEvent: "add-einnahmen",
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahme/0/daten",
      userInput: {
        "einnahmen#beschreibung": "Einnahme",
        "einnahmen#betrag": "100",
        "einnahmen#zahlungsfrequenz": "quarterly",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen-uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        einnahmen: [
          {
            beschreibung: "Einnahme",
            betrag: "100",
            zahlungsfrequenz: "quarterly",
          },
        ],
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
    },
  ],
} satisfies FlowTestCases["testcases"];

const frageVermoegenNotFulfilled = {
  frageVermoegenNotFulfilledAdultChild: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        minderjaehrig: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
      userInput: {
        child: {
          geburtsdatum: "10.10.2005",
        },
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
      userInput: {
        unterhaltsOrAbstammungssachen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
      userInput: {
        rechtlichesThema: "unterhalt",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/hinweis-weiteres-formular",
    },
  ],
  frageVermoegenNotFulfilledNotAboutUnterhalt: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        minderjaehrig: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
      userInput: {
        child: {
          geburtsdatum: "10.10.2015",
        },
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
      userInput: {
        unterhaltsOrAbstammungssachen: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/hinweis-weiteres-formular",
    },
  ],
  frageVermoegenNotFulfilledWrongThema: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        minderjaehrig: "yes",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
      userInput: {
        child: {
          geburtsdatum: "10.10.2015",
        },
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
      userInput: {
        unterhaltsOrAbstammungssachen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
      userInput: {
        rechtlichesThema: "other",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/hinweis-weiteres-formular",
    },
  ],
  frageVermoegenNotFulfilledHighIncome: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        minderjaehrig: "yes",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
      userInput: {
        child: {
          geburtsdatum: "10.10.2005",
        },
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
      userInput: {
        unterhaltsOrAbstammungssachen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
      userInput: {
        rechtlichesThema: "unterhalt",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
      userInput: {
        hasEinnahmen: "yes",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen-value",
      userInput: {
        hohesEinkommen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen-uebersicht",
      addArrayItemEvent: "add-einnahmen",
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahme/0/daten",
      userInput: {
        "einnahmen#beschreibung": "Einnahme",
        "einnahmen#betrag": "100",
        "einnahmen#zahlungsfrequenz": "quarterly",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen-uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        einnahmen: [
          {
            beschreibung: "Einnahme",
            betrag: "100",
            zahlungsfrequenz: "quarterly",
          },
        ],
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/hinweis-weiteres-formular",
    },
  ],
} satisfies FlowTestCases["testcases"];

export const testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung: FlowTestCases["testcases"] =
  {
    veChildData: [
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/kind",
        userInput: {
          child: {
            vorname: "Max",
            nachname: "Mustermann",
          },
        },
      },
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/zusammenleben",
        userInput: {
          livesTogether: "no",
        },
      },
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/unterhalt",
        userInput: {
          child: {
            unterhaltsSumme: "100",
          },
        },
      },
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      },
    ],
    ...frageVermoegenFulfilled,
    ...frageVermoegenNotFulfilled,
    veEinnahmenNotEntered: [
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
        userInput: {
          hasEinnahmen: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/einnahmen-value",
        userInput: {
          hohesEinkommen: "no",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/einnahmen-uebersicht",
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/einnahmen-warnung",
      },
    ],
    veNoVermoegen: [
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
        userInput: {
          hasVermoegen: "no",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/hinweis-vereinfachte-erklaerung",
      },
    ],
    veVermoegenOver10000: [
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
        userInput: {
          hasVermoegen: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen-value",
        userInput: {
          vermoegenUnder10000: "no",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/hinweis-weiteres-formular",
      },
    ],
    veVermoegenNotEntered: [
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
        userInput: {
          hasVermoegen: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen-value",
        userInput: {
          vermoegenUnder10000: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen-uebersicht",
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen-warnung",
      },
    ],
    veVrmoegenUnder10000: [
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
        userInput: {
          hasVermoegen: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen-value",
        userInput: {
          vermoegenUnder10000: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen-uebersicht",
        addArrayItemEvent: "add-vermoegen",
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen-eintrag/0/daten",
        userInput: {
          "vermoegen#beschreibung": "Test",
          "vermoegen#wert": "1000",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen-uebersicht",
        skipPageSchemaValidation: true,
        userInput: {
          hasVermoegen: "yes",
          vermoegen: [{ beschreibung: "Test", wert: "1000" }],
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/hinweis-vereinfachte-erklaerung",
      },
    ],
  };

export const testCasesPKHFormularAntragstellendePersonVereinfachteErklaerungTransitions =
  {
    antragstellendePersonEmpfaengerChild: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
          empfaenger: "child",
        },
      },
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/kind",
      },
    ],
    veNotEligibleTransition: [
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/hinweis-weiteres-formular",
        skipPageSchemaValidation: true,
        userInput: {
          empfaenger: "child",
          minderjaehrig: "no",
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "unterhalt",
          hasEinnahmen: "no",
        },
      },
      { stepId: "/antragstellende-person/unterhaltsanspruch" },
    ],
    veEligibleTransition: [
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/hinweis-vereinfachte-erklaerung",
        skipPageSchemaValidation: true,
        userInput: {
          empfaenger: "child",
          minderjaehrig: "yes",
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "unterhalt",
          hasEinnahmen: "no",
        },
      },
      { stepId: "/antragstellende-person/unterhaltsanspruch" },
    ],
  } satisfies FlowTestCases["testcases"];
