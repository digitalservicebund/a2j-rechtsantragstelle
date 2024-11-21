import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngaben } from "~/domains/beratungshilfe/formular/finanzielleAngaben/context";
// unterhalt
const finanzielleAngabenPartnerZusammenleben =
  "/finanzielle-angaben/partner/zusammenleben";
const finanzielleAngabenPartnerPartnerEinkommen =
  "/finanzielle-angaben/partner/partner-einkommen";
const finanzielleAngabenPartnerUnterhalt =
  "/finanzielle-angaben/partner/unterhalt";
const finanzielleAngabenPartnerPartnerschaft =
  "/finanzielle-angaben/partner/partnerschaft";
const finanzielleAngabenKinderKinderFrage =
  "/finanzielle-angaben/kinder/kinder-frage";
const cases = [
  [
    {},
    [
      finanzielleAngabenPartnerPartnerschaft,
      finanzielleAngabenKinderKinderFrage,
    ],
  ],
  [
    { partnerschaft: "no", unterhalt: "yes" },
    [
      finanzielleAngabenPartnerPartnerschaft,
      finanzielleAngabenKinderKinderFrage,
    ],
  ],
  [
    { partnerschaft: "separated" },
    [
      finanzielleAngabenPartnerPartnerschaft,
      finanzielleAngabenKinderKinderFrage,
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", unterhalt: "yes" },
    [
      finanzielleAngabenPartnerPartnerschaft,
      finanzielleAngabenPartnerZusammenleben,
      finanzielleAngabenPartnerPartnerEinkommen,
      finanzielleAngabenKinderKinderFrage,
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
      finanzielleAngabenPartnerPartnerschaft,
      finanzielleAngabenPartnerZusammenleben,
      finanzielleAngabenPartnerPartnerEinkommen,
      finanzielleAngabenKinderKinderFrage,
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
      finanzielleAngabenPartnerPartnerschaft,
      finanzielleAngabenPartnerZusammenleben,
      finanzielleAngabenPartnerPartnerEinkommen,
      "/finanzielle-angaben/partner/partner-einkommen-summe",
      finanzielleAngabenKinderKinderFrage,
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no", unterhalt: "no" },
    [
      finanzielleAngabenPartnerPartnerschaft,
      finanzielleAngabenPartnerZusammenleben,
      finanzielleAngabenPartnerUnterhalt,
      "/finanzielle-angaben/partner/keine-rolle",
      finanzielleAngabenKinderKinderFrage,
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no", unterhalt: "yes" },
    [
      finanzielleAngabenPartnerPartnerschaft,
      finanzielleAngabenPartnerZusammenleben,
      finanzielleAngabenPartnerUnterhalt,
      "/finanzielle-angaben/partner/unterhalts-summe",
      "/finanzielle-angaben/partner/partner-name",
      finanzielleAngabenKinderKinderFrage,
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
      "/finanzielle-angaben/partner/partner-name",
      finanzielleAngabenKinderKinderFrage,
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenPartner = {
  machine,
  cases,
};
