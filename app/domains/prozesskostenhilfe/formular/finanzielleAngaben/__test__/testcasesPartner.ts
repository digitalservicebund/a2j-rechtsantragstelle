import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";
const prefix = "/finanzielle-angaben/partner";

export const testCasesPKHFormularFinanzielleAngabenPartner = [
  [
    { partnerschaft: "widowed" },
    [prefix + "/partnerschaft", "/finanzielle-angaben/kinder/kinder-frage"],
  ],
  [
    { partnerschaft: "no" },
    [prefix + "/partnerschaft", "/finanzielle-angaben/kinder/kinder-frage"],
  ],
  [
    { partnerschaft: "separated" },
    [prefix + "/partnerschaft", "/finanzielle-angaben/kinder/kinder-frage"],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", partnerEinkommen: "yes" },
    [
      prefix + "/partnerschaft",
      prefix + "/zusammenleben",
      prefix + "/partner-einkommen",
      prefix + "/partner-einkuenfte/partner-staatliche-leistungen",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", partnerEinkommen: "yes" },
    [
      prefix + "/partnerschaft",
      prefix + "/zusammenleben",
      prefix + "/partner-einkommen",
      prefix + "/partner-einkuenfte/partner-staatliche-leistungen",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no" },
    [
      prefix + "/partnerschaft",
      prefix + "/zusammenleben",
      prefix + "/unterhalt",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      zusammenleben: "no",
      unterhalt: "yes",
      partnerUnterhaltsSumme: "123",
      partnerVorname: "Dagobert",
      partnerNachname: "Duck",
    },
    [
      prefix + "/unterhalt",
      prefix + "/unterhalts-summe",
      prefix + "/partner-name",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      zusammenleben: "no",
      unterhalt: "no",
    },
    [
      prefix + "/unterhalt",
      prefix + "/keine-rolle",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;
