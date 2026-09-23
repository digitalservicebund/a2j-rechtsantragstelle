import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "../../../userData";
import { PKHTestcaseData } from "../../../__test__/testcasesData";

const frageVermoegenFulfilled = {
  frageVermoegenFulfilledUnterhalt: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        ...PKHTestcaseData,
        empfaenger: "child",
        minderjaehrig: "yes",
        verfahrenArt: "verfahrenAnwalt",
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "10.10.2005",
        },
        livesTogether: "yes",
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
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
    },
  ],
  frageVermoegenFulfilledVollstreckung: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        ...PKHTestcaseData,
        empfaenger: "child",
        minderjaehrig: "yes",
        verfahrenArt: "verfahrenAnwalt",
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "10.10.2005",
        },
        livesTogether: "yes",
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
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
    },
  ],
  frageVermoegenFulfilledAbstammung: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        ...PKHTestcaseData,
        empfaenger: "child",
        minderjaehrig: "yes",
        verfahrenArt: "verfahrenAnwalt",
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "10.10.2005",
        },
        livesTogether: "yes",
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
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
      userInput: {
        hasEinnahmen: "no",
      },
    },
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
    },
  ],
  frageVermoegenFulfilledEinkommen: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        ...PKHTestcaseData,
        empfaenger: "child",
        minderjaehrig: "yes",
        verfahrenArt: "verfahrenAnwalt",
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "10.10.2005",
        },
        livesTogether: "yes",
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
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
      userInput: {
        hasEinnahmen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-value",
      userInput: {
        hohesEinkommen: "no",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/uebersicht",
      addArrayItemEvent: "add-einnahmen",
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/daten",
      userInput: {
        "einnahmen#beschreibung": "Einnahme",
        "einnahmen#betrag": "100",
        "einnahmen#zahlungsfrequenz": "quarterly",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/uebersicht",
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
      stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;

const frageVermoegenNotFulfilled = {
  frageVermoegenNotFulfilledAdultChild: [
    {
      stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
      userInput: {
        ...PKHTestcaseData,
        empfaenger: "child",
        minderjaehrig: "no",
        verfahrenArt: "verfahrenAnwalt",
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "10.10.2005",
        },
        livesTogether: "yes",
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
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
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
        ...PKHTestcaseData,
        empfaenger: "child",
        minderjaehrig: "no",
        verfahrenArt: "verfahrenAnwalt",
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "10.10.2005",
        },
        livesTogether: "yes",
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
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
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
        ...PKHTestcaseData,
        empfaenger: "child",
        minderjaehrig: "yes",
        verfahrenArt: "verfahrenAnwalt",
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "10.10.2005",
        },
        livesTogether: "yes",
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
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
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
        ...PKHTestcaseData,
        empfaenger: "child",
        minderjaehrig: "yes",
        verfahrenArt: "verfahrenAnwalt",
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "10.10.2005",
        },
        livesTogether: "yes",
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
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
      userInput: {
        hasEinnahmen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-value",
      userInput: {
        hohesEinkommen: "yes",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/uebersicht",
      addArrayItemEvent: "add-einnahmen",
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/daten",
      userInput: {
        "einnahmen#beschreibung": "Einnahme",
        "einnahmen#betrag": "100",
        "einnahmen#zahlungsfrequenz": "quarterly",
      },
    },
    {
      stepId:
        "/antragstellende-person/vereinfachte-erklaerung/einnahmen/uebersicht",
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
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;

export const testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung: FlowTestCases<ProzesskostenhilfeFormularUserData> =
  {
    veChildData: [
      {
        stepId: "/antragstellende-person/vereinfachte-erklaerung/kind",
        userInput: {
          ...PKHTestcaseData,
          empfaenger: "child",
          verfahrenArt: "verfahrenAnwalt",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "10.10.2005",
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
        userInput: {
          minderjaehrig: "yes",
        },
      },
    ],
    ...frageVermoegenFulfilled,
    ...frageVermoegenNotFulfilled,
    veEinnahmenNotEntered: [
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
        userInput: {
          ...PKHTestcaseData,
          empfaenger: "child",
          minderjaehrig: "yes",
          verfahrenArt: "verfahrenAnwalt",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "10.10.2005",
          },
          livesTogether: "yes",
          hasEinnahmen: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-value",
        userInput: {
          hohesEinkommen: "no",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/einnahmen/uebersicht",
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/einnahmen/warnung",
      },
    ],
    veNoVermoegen: [
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
        userInput: {
          ...PKHTestcaseData,
          empfaenger: "child",
          minderjaehrig: "yes",
          verfahrenArt: "verfahrenAnwalt",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "10.10.2005",
          },
          livesTogether: "no",
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
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
        userInput: {
          ...PKHTestcaseData,
          empfaenger: "child",
          minderjaehrig: "yes",
          verfahrenArt: "verfahrenAnwalt",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "10.10.2005",
          },
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "unterhalt",

          livesTogether: "yes",
          hasEinnahmen: "no",
          hasVermoegen: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/value",
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
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
        userInput: {
          ...PKHTestcaseData,
          empfaenger: "child",
          minderjaehrig: "yes",
          verfahrenArt: "verfahrenAnwalt",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "10.10.2005",
          },
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "unterhalt",

          livesTogether: "yes",
          hasEinnahmen: "no",
          hasVermoegen: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/value",
        userInput: {
          vermoegenUnder10000: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/uebersicht",
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/warnung",
      },
    ],
    veVermoegenUnder10000: [
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
        userInput: {
          ...PKHTestcaseData,
          empfaenger: "child",
          minderjaehrig: "yes",
          verfahrenArt: "verfahrenAnwalt",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "10.10.2005",
          },
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "unterhalt",
          livesTogether: "yes",
          hasEinnahmen: "no",
          hasVermoegen: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/value",
        userInput: {
          vermoegenUnder10000: "yes",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/uebersicht",
        addArrayItemEvent: "add-vermoegen",
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/eintrag/0/daten",
        userInput: {
          "vermoegen#beschreibung": "Test",
          "vermoegen#wert": "1000",
        },
      },
      {
        stepId:
          "/antragstellende-person/vereinfachte-erklaerung/vermoegen/uebersicht",
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
          ...PKHTestcaseData,
          empfaenger: "child",
          minderjaehrig: "no",
          verfahrenArt: "verfahrenAnwalt",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "10.10.2005",
          },
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "unterhalt",

          livesTogether: "yes",
          hasEinnahmen: "no",
          hasVermoegen: "yes",
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
          ...PKHTestcaseData,
          empfaenger: "child",
          minderjaehrig: "yes",
          verfahrenArt: "verfahrenAnwalt",
          child: {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: "10.10.2005",
          },
          unterhaltsOrAbstammungssachen: "yes",
          rechtlichesThema: "unterhalt",
          livesTogether: "yes",
          hasEinnahmen: "no",
          hasVermoegen: "yes",
        },
      },
      { stepId: "/antragstellende-person/unterhaltsanspruch" },
    ],
  } satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
