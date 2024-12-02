import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/prozesskostenhilfe/formular/__test__/testcases";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "../context";
const prefix = "/rechtsschutzversicherung";

const cases = [
  [
    {
      hasRsv: "no",
    },
    ["/rsv-frage", "/org-frage"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "yes",
    },
    ["/rsv-frage", "/rsv-deckung", "/rsv-deckung-ja"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "unknown",
    },
    ["/rsv-frage", "/rsv-deckung", "/rsv-deckung-unbekannt"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "no",
    },
    ["/rsv-frage", "/rsv-deckung", "/rsv-deckung-nein", "/org-frage"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "partly",
    },
    ["/rsv-frage", "/rsv-deckung", "/rsv-deckung-teilweise", "/org-frage"],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung"],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "unknown",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-unbekannt"],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "yes",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-ja"],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-nein"],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "partly",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-teilweise"],
  ],
] satisfies TestCases<ProzesskostenhilfeRechtsschutzversicherungContext>;

export const testCasesProzesskostenhilfeRsv = {
  machine,
  cases: cases.map(([data, steps]) => [
    data,
    steps.map((stepId) => prefix + stepId),
  ]) satisfies TestCases<ProzesskostenhilfeRechtsschutzversicherungContext>,
};
