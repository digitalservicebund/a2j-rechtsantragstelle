import type { TestCases } from "~/flows/__test__/TestCases";
import { machine } from "~/flows/beratungshilfe/beratungshilfeFormular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngaben } from "~/flows/beratungshilfe/beratungshilfeFormular/finanzielleAngaben/context";

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
