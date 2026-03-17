import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";
import { erbscheinWegweiserXstateConfig } from "~/domains/erbschein/wegweiser/xStateConfig";

export const erbscheinWegweiserTestCases = {
  xstateConfig: erbscheinWegweiserXstateConfig,
  testcases: {
    severalNationalities: [
      {
        stepId: "/start",
      },
      {
        stepId: "/staatsangehoerigkeit",
        userInput: {
          staatsangehoerigkeit: "germanAndOther",
        },
      },
      {
        stepId: "/ergebnis/auslaendische-erbfaelle",
      },
    ],
    livedAbroad: [
      {
        stepId: "/staatsangehoerigkeit",
        userInput: {
          staatsangehoerigkeit: "german",
        },
      },
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "ausland",
        },
      },
      {
        stepId: "/ergebnis/auslaendische-erbfaelle",
      },
    ],
    notarizedTestament: [
      {
        stepId: "/lebensmittelpunkt",
        userInput: {
          lebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "notarized",
        },
      },
      {
        stepId: "/ergebnis/erbschein-nicht-erforderlich-notarielles-testament",
      },
    ],
    erbvertrag: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "erbvertrag",
        },
      },
      {
        stepId: "/ergebnis/erbschein-nicht-erforderlich-erbvertrag",
      },
    ],
    hasGrundeigentumWithHandwrittenTestament: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "handwritten",
        },
      },
      {
        stepId: "/grundeigentum",
        userInput: {
          hasGrundeigentum: "yes",
        },
      },
      {
        stepId: "/erbschein-erforderlich-handschriftliches-testament",
      },
    ],
    hasGrundeigentumWithNoTestament: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "none",
        },
      },
      {
        stepId: "/grundeigentum",
        userInput: {
          hasGrundeigentum: "yes",
        },
      },
      {
        stepId: "/erbschein-erforderlich-kein-testament",
      },
    ],
    hasUnternehmenWithHandwrittenTestament: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "handwritten",
        },
      },
      {
        stepId: "/grundeigentum",
        userInput: {
          hasGrundeigentum: "no",
        },
      },
      {
        stepId: "/unternehmen",
        userInput: {
          hasUnternehmen: "yes",
        },
      },
      {
        stepId: "/erbschein-erforderlich-handschriftliches-testament",
      },
    ],
    hasUnternehmenWithNoTestament: [
      {
        stepId: "/testament-oder-erbvertrag",
        userInput: {
          testamentType: "none",
        },
      },
      {
        stepId: "/grundeigentum",
        userInput: {
          hasGrundeigentum: "no",
        },
      },
      {
        stepId: "/unternehmen",
        userInput: {
          hasUnternehmen: "yes",
        },
      },
      {
        stepId: "/erbschein-erforderlich-kein-testament",
      },
    ],
    erbscheinNotRequired: [
      {
        stepId: "/unternehmen",
        userInput: {
          hasUnternehmen: "no",
        },
      },
      {
        stepId: "/erbschein-verlangt",
        userInput: {
          bankRequestedErbschein: "no",
        },
      },
      {
        stepId: "/ergebnis/erbschein-nicht-erforderlich-nicht-verlangt",
      },
    ],
    erbscheinRequired: [
      {
        stepId: "/erbschein-verlangt",
        userInput: {
          bankRequestedErbschein: "yes",
        },
      },
      {
        stepId: "/erbschein-erforderlich-kein-testament",
      },
    ],

    // ==========================================================================
    // FAMILY TREE COLLECTION (new geschlossen variant)
    // ==========================================================================

    // Test: Entry from informational page to family tree collection
    familyTreeEntryFromResult: [
      {
        stepId: "/erbschein-erforderlich-kein-testament",
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/erbfolge-ehepartner-frage",
        userInput: { hatEhepartner: "no" },
      },
      {
        stepId: "/erbfolge-kinder-frage",
        userInput: { hatKinder: "no" },
      },
      // No children → goes directly to 2nd order (eltern)
      {
        stepId: "/erbfolge-eltern-frage",
        skipPageSchemaValidation: true,
      },
    ],
    familyTreeEntryFromHandwrittenResult: [
      {
        stepId: "/erbschein-erforderlich-handschriftliches-testament",
        userInput: { testamentType: "handwritten" },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/erbfolge-ehepartner-frage",
        skipPageSchemaValidation: true,
      },
    ],

    // Test: Full family tree with spouse and living children → result
    familyTreeWithLivingChildren: [
      {
        stepId: "/erbfolge-ehepartner-frage",
        userInput: { hatEhepartner: "yes" },
      },
      {
        stepId: "/erbfolge-ehepartner-daten",
        userInput: {
          ehepartnerVorname: "Maria",
          ehepartnerIstVerstorben: "no",
        },
      },
      {
        stepId: "/erbfolge-kinder-frage",
        userInput: { hatKinder: "yes" },
      },
      {
        stepId: "/erbfolge-kinder-anzahl",
        userInput: { kinderAnzahl: "2" },
      },
      {
        stepId: "/erbfolge-kinder-eingabe",
        userInput: {
          kinder: [
            { vorname: "Max", istVerstorben: "no" },
            { vorname: "Anna", istVerstorben: "no" },
          ],
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/erbfolge-kinder-uebersicht",
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/ergebnis/erbfolge-ergebnis",
        skipPageSchemaValidation: true,
      },
    ],
    familyTreeWithLivingGrandchild: [
      {
        stepId: "/erbfolge-ehepartner-frage",
        userInput: { hatEhepartner: "no" },
      },
      {
        stepId: "/erbfolge-kinder-frage",
        userInput: { hatKinder: "yes" },
      },
      {
        stepId: "/erbfolge-kinder-anzahl",
        userInput: { kinderAnzahl: "1" },
      },
      {
        stepId: "/erbfolge-kinder-eingabe",
        userInput: {
          kinder: [
            {
              vorname: "Anna",
              istVerstorben: "yes",
              hatKinder: "yes",
              kinderAnzahl: 1,
              kinder: [{ vorname: "Lena", istVerstorben: "no" }],
            },
          ],
        },
      },
      {
        stepId: "/erbfolge-kinder-uebersicht",
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/ergebnis/erbfolge-ergebnis",
        skipPageSchemaValidation: true,
      },
    ],

    // Test: No 1st order heirs → 2nd order flow (parents, siblings)
    familyTree2ndOrder: [
      {
        stepId: "/erbfolge-ehepartner-frage",
        userInput: { hatEhepartner: "no" },
      },
      {
        stepId: "/erbfolge-kinder-frage",
        userInput: { hatKinder: "no" },
      },
      {
        stepId: "/erbfolge-eltern-frage",
        userInput: { hatEltern: "yes" },
      },
      {
        stepId: "/erbfolge-eltern-eingabe",
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/erbfolge-geschwister-frage",
        userInput: { hatGeschwister: "yes" },
      },
      {
        stepId: "/erbfolge-geschwister-anzahl",
        userInput: { geschwisterAnzahl: "1" },
      },
      {
        stepId: "/erbfolge-geschwister-eingabe",
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/erbfolge-geschwister-uebersicht",
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/ergebnis/erbfolge-ergebnis",
        skipPageSchemaValidation: true,
      },
    ],
    familyTree2ndOrderWithNichtenAndGrossnichten: [
      {
        stepId: "/erbfolge-ehepartner-frage",
        userInput: { hatEhepartner: "no" },
      },
      {
        stepId: "/erbfolge-kinder-frage",
        userInput: { hatKinder: "no" },
      },
      {
        stepId: "/erbfolge-eltern-frage",
        userInput: { hatEltern: "no" },
      },
      {
        stepId: "/erbfolge-geschwister-frage",
        userInput: { hatGeschwister: "yes" },
      },
      {
        stepId: "/erbfolge-geschwister-anzahl",
        userInput: { geschwisterAnzahl: "1" },
      },
      {
        stepId: "/erbfolge-geschwister-eingabe",
        userInput: {
          geschwister: [
            {
              vorname: "Karl",
              istVerstorben: "yes",
              istHalbgeschwister: false,
              hatKinder: "yes",
              kinderAnzahl: 1,
              kinder: [
                {
                  vorname: "Nina",
                  istVerstorben: "yes",
                  hatKinder: "yes",
                  kinderAnzahl: 1,
                  kinder: [{ vorname: "Lea" }],
                },
              ],
            },
          ],
        },
      },
      {
        stepId: "/erbfolge-geschwister-uebersicht",
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/ergebnis/erbfolge-ergebnis",
        skipPageSchemaValidation: true,
      },
    ],
  },
} satisfies FlowTestConfig<ErbscheinWegweiserUserData>;
