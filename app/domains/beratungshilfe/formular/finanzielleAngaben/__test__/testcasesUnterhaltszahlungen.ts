import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";

const cases = [
  [
    { hasWeitereUnterhaltszahlungen: "no" },
    [
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "/finanzielle-angaben/wohnung/wohnsituation",
    ],
  ],
  [
    {
      hasWeitereUnterhaltszahlungen: "yes",
      unterhaltszahlungen: [
        {
          firstName: "a",
          surname: "b",
          familyRelationship: "kid",
          birthday: "10.10.2010",
          monthlyPayment: "10",
        },
      ],
    },
    [
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      "/finanzielle-angaben/wohnung/wohnsituation",
    ],
  ],
  [
    { hasWeitereUnterhaltszahlungen: "yes" },
    [
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      "/finanzielle-angaben/andere-unterhaltszahlungen/warnung",
    ],
  ],

  // Person only one page in the flow
  [
    { hasWeitereUnterhaltszahlungen: "yes" },
    ["/finanzielle-angaben/andere-unterhaltszahlungen/person/daten"],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngabenUserData>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen =
  {
    machine,
    cases,
  };
