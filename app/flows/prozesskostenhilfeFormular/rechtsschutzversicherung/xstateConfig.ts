import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "./context";
import { rechtsschutzversicherungDone } from "./doneFunctions";

export function getProzesskostenhilfeRsvXstateConfig(
  transitions?: FlowConfigTransitions,
): Config<ProzesskostenhilfeRechtsschutzversicherungContext> {
  return {
    id: "rechtsschutzversicherung",
    initial: "rsv-frage",
    meta: { done: rechtsschutzversicherungDone },
    states: {
      "rsv-frage": {
        on: {
          BACK: transitions?.backToCallingFlow,
          SUBMIT: [
            {
              guard: ({ context }) => context.hasRsv === "yes",
              target: "rsv-deckung",
            },
            "org-frage",
          ],
        },
      },
      "rsv-deckung": {
        on: {
          BACK: "rsv-frage",
          SUBMIT: [
            {
              guard: ({ context }) => context.hasRsvCoverage === "yes",
              target: "rsv-deckung-ja",
            },
            {
              guard: ({ context }) => context.hasRsvCoverage === "partly",
              target: "rsv-deckung-teilweise",
            },
            {
              guard: ({ context }) => context.hasRsvCoverage === "no",
              target: "rsv-deckung-nein",
            },
            {
              guard: ({ context }) => context.hasRsvCoverage === "unknown",
              target: "rsv-deckung-unbekannt",
            },
          ],
        },
      },
      "rsv-deckung-ja": {
        on: {
          BACK: "rsv-deckung",
        },
      },
      "rsv-deckung-unbekannt": {
        on: {
          BACK: "rsv-deckung",
        },
      },
      "rsv-deckung-nein": {
        on: {
          BACK: "rsv-deckung",
          SUBMIT: "org-frage",
        },
      },
      "rsv-deckung-teilweise": {
        on: {
          BACK: "rsv-deckung",
          SUBMIT: "org-frage",
        },
      },
      "org-frage": {
        on: {
          BACK: [
            {
              guard: ({ context }) => context.hasRsvCoverage === "no",
              target: "rsv-deckung-nein",
            },
            {
              guard: ({ context }) => context.hasRsvCoverage === "partly",
              target: "rsv-deckung-teilweise",
            },
            "rsv-frage",
          ],
          SUBMIT: [
            {
              guard: ({ context }) => context.hasRsvThroughOrg === "yes",
              target: "org-deckung",
            },
            transitions?.nextFlowEntrypoint as string,
          ],
        },
      },
      "org-deckung": {
        on: {
          BACK: "org-frage",
          SUBMIT: [
            {
              guard: ({ context }) => context.hasOrgCoverage === "yes",
              target: "org-deckung-ja",
            },
            {
              guard: ({ context }) => context.hasOrgCoverage === "partly",
              target: "org-deckung-teilweise",
            },
            {
              guard: ({ context }) => context.hasOrgCoverage === "no",
              target: "org-deckung-nein",
            },
            {
              guard: ({ context }) => context.hasOrgCoverage === "unknown",
              target: "org-deckung-unbekannt",
            },
          ],
        },
      },
      "org-deckung-ja": {
        on: {
          BACK: "org-deckung",
        },
      },
      "org-deckung-unbekannt": {
        on: {
          BACK: "org-deckung",
        },
      },
      "org-deckung-nein": {
        on: {
          BACK: "org-deckung",
          SUBMIT: transitions?.nextFlowEntrypoint,
        },
      },
      "org-deckung-teilweise": {
        on: {
          BACK: "org-deckung",
          SUBMIT: transitions?.nextFlowEntrypoint,
        },
      },
    },
  };
}
