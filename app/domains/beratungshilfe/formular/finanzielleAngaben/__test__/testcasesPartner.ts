import type { FlowTestCases } from "~/domains/__test__/TestCases";
const finanzielleAngabenPartnerPartnerschaft =
  "/finanzielle-angaben/partner/partnerschaft";
const finanzielleAngabenKinderKinderFrage =
  "/finanzielle-angaben/kinder/kinder-frage";
const finanzielleAngabenPartnerZusammenleben =
  "/finanzielle-angaben/partner/zusammenleben";
const finanzielleAngabenPartnerPartnerEinkommen =
  "/finanzielle-angaben/partner/partner-einkommen";
const finanzielleAngabenPartnerUnterhalt =
  "/finanzielle-angaben/partner/unterhalt";

export const testCasesBeratungshilfeFormularFinanzielleAngabenPartner = {
  noPartnerschaft: [
    {
      stepId: finanzielleAngabenPartnerPartnerschaft,
      userInput: {
        partnerschaft: "no",
      },
    },
    {
      stepId: finanzielleAngabenKinderKinderFrage,
    },
  ],
  separated: [
    {
      stepId: finanzielleAngabenPartnerPartnerschaft,
      userInput: {
        partnerschaft: "separated",
      },
    },
    {
      stepId: finanzielleAngabenKinderKinderFrage,
    },
  ],
  liveInPartnerUnteraltNoIncome: [
    {
      stepId: finanzielleAngabenPartnerPartnerschaft,
      userInput: {
        partnerschaft: "yes",
      },
    },
    {
      stepId: finanzielleAngabenPartnerZusammenleben,
      userInput: {
        partnerschaft: "yes",
        zusammenleben: "yes",
      },
    },
    {
      stepId: finanzielleAngabenPartnerPartnerEinkommen,
      userInput: {
        partnerEinkommen: "no",
      },
    },
    {
      stepId: finanzielleAngabenKinderKinderFrage,
    },
  ],
  partnerLivesSeparatelyNoUnterhalt: [
    {
      stepId: finanzielleAngabenPartnerPartnerschaft,
      userInput: {
        partnerschaft: "yes",
      },
    },
    {
      stepId: finanzielleAngabenPartnerZusammenleben,
      userInput: {
        zusammenleben: "no",
      },
    },
    {
      stepId: finanzielleAngabenPartnerUnterhalt,
      userInput: {
        unterhalt: "no",
      },
    },
    { stepId: "/finanzielle-angaben/partner/keine-rolle" },
    {
      stepId: finanzielleAngabenKinderKinderFrage,
    },
  ],
  partnerWithIncome: [
    {
      stepId: finanzielleAngabenPartnerPartnerschaft,
      userInput: {
        partnerschaft: "yes",
      },
    },
    {
      stepId: finanzielleAngabenPartnerZusammenleben,
      userInput: {
        partnerschaft: "yes",
        zusammenleben: "yes",
      },
    },
    {
      stepId: finanzielleAngabenPartnerPartnerEinkommen,
      userInput: {
        partnerEinkommen: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partner-einkommen-summe",
      userInput: {
        partnerEinkommenSumme: "1000",
      },
    },
    {
      stepId: finanzielleAngabenKinderKinderFrage,
    },
  ],
  partnerReceivesUnterhalt: [
    {
      stepId: finanzielleAngabenPartnerPartnerschaft,
      userInput: {
        partnerschaft: "yes",
      },
    },
    {
      stepId: finanzielleAngabenPartnerZusammenleben,
      userInput: {
        zusammenleben: "no",
      },
    },
    {
      stepId: finanzielleAngabenPartnerUnterhalt,
      userInput: {
        unterhalt: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/unterhalts-summe",
      userInput: {
        partnerUnterhaltsSumme: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partner-name",
      userInput: {
        partnerVorname: "Max",
        partnerNachname: "Mustermann",
      },
    },
    {
      stepId: finanzielleAngabenKinderKinderFrage,
    },
  ],
} satisfies FlowTestCases["testcases"];
