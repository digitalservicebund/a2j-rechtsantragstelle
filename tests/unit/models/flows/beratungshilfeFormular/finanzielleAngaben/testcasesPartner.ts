import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "no" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/partner-einkommen",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", partnerEinkommen: "no" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/partner-einkommen",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", partnerEinkommen: "yes" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/partner-einkommen",
      "finanzielleAngaben/partner/partner-einkommen-summe",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/unterhalt",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no", unterhalt: "no" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/unterhalt",
      "finanzielleAngaben/partner/keine-rolle",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no", unterhalt: "yes" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/unterhalt",
      "finanzielleAngaben/partner/unterhalts-summe",
      "finanzielleAngaben/partner/partner-name",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { unterhalt: "yes", partnerschaft: "yes", partnerEinkommen: "yes" },
    [
      "finanzielleAngaben/partner/partner-name",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenPartner = {
  machine,
  cases,
};
