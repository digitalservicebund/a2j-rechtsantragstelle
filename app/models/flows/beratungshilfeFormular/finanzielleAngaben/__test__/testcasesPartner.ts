import { machine } from "~/models/flows/beratungshilfeFormular/__test__/testMachine";
import type { TestCases } from "~/models/flows/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";
// unterhalt
const cases = [
  [
    {},
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "no", unterhalt: "yes" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", unterhalt: "yes" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", unterhalt: "yes" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/partner-einkommen",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      zusammenleben: "yes",
      partnerEinkommen: "no",
      unterhalt: "yes",
    },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/partner-einkommen",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      zusammenleben: "yes",
      partnerEinkommen: "yes",
      unterhalt: "yes",
    },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/partner-einkommen",
      "finanzielle-angaben/partner/partner-einkommen-summe",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/unterhalt",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no", unterhalt: "no" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/unterhalt",
      "finanzielle-angaben/partner/keine-rolle",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no", unterhalt: "yes" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/unterhalt",
      "finanzielle-angaben/partner/unterhalts-summe",
      "finanzielle-angaben/partner/partner-name",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      unterhalt: "yes",
      partnerschaft: "yes",
      partnerEinkommen: "yes",
      zusammenleben: "no",
    },
    [
      "finanzielle-angaben/partner/partner-name",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenPartner = {
  machine,
  cases,
};
