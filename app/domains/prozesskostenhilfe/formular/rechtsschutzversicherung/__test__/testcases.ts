import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeRechtsschutzversicherungUserData } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/userData";
import { PKHTestcaseData } from "~/domains/prozesskostenhilfe/formular/__test__/testcasesData";

export const testCasesPKHFormularRsv = {
  noRsv: [
    {
      stepId: "/rechtsschutzversicherung/rsv-frage",
      userInput: {
        ...PKHTestcaseData,
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-frage",
    },
  ],
  rsvWithCoverage: [
    {
      stepId: "/rechtsschutzversicherung/rsv-frage",
      userInput: {
        ...PKHTestcaseData,
        hasRsv: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/rsv-deckung",
      userInput: {
        hasRsvCoverage: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/rsv-deckung-ja",
    },
  ],
  rsvCoverageUnknown: [
    {
      stepId: "/rechtsschutzversicherung/rsv-frage",
      userInput: {
        ...PKHTestcaseData,
        hasRsv: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/rsv-deckung",
      userInput: {
        hasRsvCoverage: "unknown",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/rsv-deckung-unbekannt",
    },
  ],
  rsvWithoutCoverage: [
    {
      stepId: "/rechtsschutzversicherung/rsv-frage",
      userInput: {
        ...PKHTestcaseData,
        hasRsv: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/rsv-deckung",
      userInput: {
        hasRsvCoverage: "no",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/rsv-deckung-nein",
    },
    {
      stepId: "/rechtsschutzversicherung/org-frage",
    },
  ],
  rsvPartialCoverage: [
    {
      stepId: "/rechtsschutzversicherung/rsv-frage",
      userInput: {
        ...PKHTestcaseData,
        hasRsv: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/rsv-deckung",
      userInput: {
        hasRsvCoverage: "partly",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/rsv-deckung-teilweise",
    },
    {
      stepId: "/rechtsschutzversicherung/org-frage",
    },
  ],
  rsvThroughOrgWithoutCoverage: [
    {
      stepId: "/rechtsschutzversicherung/org-frage",
      userInput: {
        ...PKHTestcaseData,
        hasRsvThroughOrg: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-deckung",
      userInput: {
        hasOrgCoverage: "no",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-deckung-nein",
    },
  ],
  orgDeckungUnknown: [
    {
      stepId: "/rechtsschutzversicherung/org-frage",
      userInput: {
        ...PKHTestcaseData,
        hasRsvThroughOrg: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-deckung",
      userInput: {
        hasOrgCoverage: "unknown",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-deckung-unbekannt",
    },
  ],
  orgDeckungYes: [
    {
      stepId: "/rechtsschutzversicherung/org-frage",
      userInput: {
        ...PKHTestcaseData,
        hasRsvThroughOrg: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-deckung",
      userInput: {
        hasOrgCoverage: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-deckung-ja",
    },
  ],
  partialOrgDeckung: [
    {
      stepId: "/rechtsschutzversicherung/org-frage",
      userInput: {
        ...PKHTestcaseData,
        hasRsvThroughOrg: "yes",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-deckung",
      userInput: {
        hasOrgCoverage: "partly",
      },
    },
    {
      stepId: "/rechtsschutzversicherung/org-deckung-teilweise",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeRechtsschutzversicherungUserData>;
