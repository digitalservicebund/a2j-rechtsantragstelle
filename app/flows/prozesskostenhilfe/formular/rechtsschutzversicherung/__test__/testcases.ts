import { createMachine } from "xstate";
import type { TestCases } from "~/flows/__test__/TestCases";
import { getProzesskostenhilfeRsvXstateConfig } from "~/flows/prozesskostenhilfe/formular/rechtsschutzversicherung/xstateConfig";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "../context";

const machine: FlowStateMachine = createMachine(
  getProzesskostenhilfeRsvXstateConfig(),
);

const cases = [
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "no",
    },
    ["rsv-frage", "org-frage"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "yes",
    },
    ["rsv-frage", "rsv-deckung", "rsv-deckung-ja"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "unknown",
    },
    ["rsv-frage", "rsv-deckung", "rsv-deckung-unbekannt"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "no",
    },
    ["rsv-frage", "rsv-deckung", "rsv-deckung-nein", "org-frage"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "partly",
    },
    ["rsv-frage", "rsv-deckung", "rsv-deckung-teilweise", "org-frage"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    ["rsv-frage", "org-frage", "org-deckung"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "unknown",
    },
    ["rsv-frage", "org-frage", "org-deckung", "org-deckung-unbekannt"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "yes",
    },
    ["rsv-frage", "org-frage", "org-deckung", "org-deckung-ja"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    ["rsv-frage", "org-frage", "org-deckung", "org-deckung-nein"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "partly",
    },
    ["rsv-frage", "org-frage", "org-deckung", "org-deckung-teilweise"],
  ],
] as const satisfies TestCases<ProzesskostenhilfeRechtsschutzversicherungContext>;

export const testCasesProzesskostenhilfeRsv = {
  machine,
  cases,
};
