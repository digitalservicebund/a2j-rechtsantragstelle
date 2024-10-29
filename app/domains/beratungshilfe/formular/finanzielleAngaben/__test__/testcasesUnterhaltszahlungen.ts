import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngaben } from "~/domains/beratungshilfe/formular/finanzielleAngaben/context";

const cases = [
  [
    { hasWeitereUnterhaltszahlungen: "no" },
    [
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "finanzielle-angaben/wohnung/wohnsituation",
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
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      "finanzielle-angaben/wohnung/wohnsituation",
    ],
  ],
  [
    { hasWeitereUnterhaltszahlungen: "yes" },
    [
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      "finanzielle-angaben/andere-unterhaltszahlungen/warnung",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen =
  {
    machine,
    cases,
  };
