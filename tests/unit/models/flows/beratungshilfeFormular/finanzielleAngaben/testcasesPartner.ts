import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "no" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/partner-einkommen",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", partnerEinkommen: "no" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/partner-einkommen",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", partnerEinkommen: "yes" },
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
    { unterhalt: "yes", partnerschaft: "yes", partnerEinkommen: "yes" },
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
