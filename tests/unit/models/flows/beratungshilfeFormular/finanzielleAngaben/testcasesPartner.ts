import { machine } from "./testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
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
    ],
  ],
  [
    { zusammenleben: "yes" },
    [
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/partner-einkommen",
    ],
  ],
  [
    { zusammenleben: "no" },
    [
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/unterhalt",
    ],
  ],
  [
    { partnerEinkommen: "yes" },
    [
      "finanzielleAngaben/partner/partner-einkommen",
      "finanzielleAngaben/partner/partner-einkommen-summe",
    ],
  ],
  [
    { partnerEinkommen: "no" },
    [
      "finanzielleAngaben/partner/partner-einkommen",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { unterhalt: "yes" },
    [
      "finanzielleAngaben/partner/unterhalt",
      "finanzielleAngaben/partner/unterhalts-summe",
    ],
  ],
  [
    { unterhalt: "no" },
    [
      "finanzielleAngaben/partner/unterhalt",
      "finanzielleAngaben/partner/keine-rolle",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenPartner = {
  machine,
  cases,
};
