import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";

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
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenUserData>;
