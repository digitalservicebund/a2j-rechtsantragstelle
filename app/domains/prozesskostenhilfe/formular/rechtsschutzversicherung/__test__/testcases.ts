import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/prozesskostenhilfe/formular/__test__/testcases";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "../context";
const prefix = "rechtsschutzversicherung/";

const cases = [
  [
    {
      hasRsv: "no",
    },
    [prefix + "rsv-frage", prefix + "org-frage"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "yes",
    },
    [prefix + "rsv-frage", prefix + "rsv-deckung", prefix + "rsv-deckung-ja"],
  ],
  [
    {
      hasRsvCoverage: "unknown",
    },
    [prefix + "rsv-deckung", prefix + "rsv-deckung-unbekannt"],
  ],
  [
    {
      hasRsvCoverage: "no",
    },
    [prefix + "rsv-deckung", prefix + "rsv-deckung-nein", prefix + "org-frage"],
  ],
  [
    {
      hasRsvCoverage: "partly",
    },
    [
      prefix + "rsv-deckung",
      prefix + "rsv-deckung-teilweise",
      prefix + "org-frage",
    ],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    [prefix + "org-frage", prefix + "org-deckung", prefix + "org-deckung-nein"],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "unknown",
    },
    [
      prefix + "org-frage",
      prefix + "org-deckung",
      prefix + "org-deckung-unbekannt",
    ],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "yes",
    },
    [prefix + "org-frage", prefix + "org-deckung", prefix + "org-deckung-ja"],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    [prefix + "org-frage", prefix + "org-deckung", prefix + "org-deckung-nein"],
  ],
  [
    {
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "partly",
    },
    [
      prefix + "org-frage",
      prefix + "org-deckung",
      prefix + "org-deckung-teilweise",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeRechtsschutzversicherungContext>;

export const testCasesProzesskostenhilfeRsv = {
  machine,
  cases,
};
