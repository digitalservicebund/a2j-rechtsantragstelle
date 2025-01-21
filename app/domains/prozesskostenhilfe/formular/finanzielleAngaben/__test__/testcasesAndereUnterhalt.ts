import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";

export const testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen = [
  [
    { hasWeitereUnterhaltszahlungen: "no" },
    [
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "/finanzielle-angaben/wohnung/alleine-zusammen",
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
      "/finanzielle-angaben/wohnung/alleine-zusammen",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;
