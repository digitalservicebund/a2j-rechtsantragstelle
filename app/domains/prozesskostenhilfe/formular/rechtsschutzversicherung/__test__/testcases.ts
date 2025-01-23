import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "../context";
const prefix = "/rechtsschutzversicherung";

export const testCasesProzesskostenhilfeRsv = (
  [
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
        hasRsv: "no",
        hasRsvThroughOrg: "yes",
        hasOrgCoverage: "no",
      },
      ["/rsv-frage", "/org-frage", "/org-deckung"],
    ],
    [
      {
        hasRsv: "no",
        hasRsvThroughOrg: "yes",
        hasOrgCoverage: "unknown",
      },
      ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-unbekannt"],
    ],
    [
      {
        hasRsv: "no",
        hasRsvThroughOrg: "yes",
        hasOrgCoverage: "yes",
      },
      ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-ja"],
    ],
    [
      {
        hasRsv: "no",
        hasRsvThroughOrg: "yes",
        hasOrgCoverage: "no",
      },
      ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-nein"],
    ],
    [
      {
        hasRsv: "no",
        hasRsvThroughOrg: "yes",
        hasOrgCoverage: "partly",
      },
      ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-teilweise"],
    ],
  ] as const
).map(([data, steps]) => [
  data,
  steps.map((stepId) => prefix + stepId),
]) satisfies TestCases<ProzesskostenhilfeRechtsschutzversicherungContext>;
