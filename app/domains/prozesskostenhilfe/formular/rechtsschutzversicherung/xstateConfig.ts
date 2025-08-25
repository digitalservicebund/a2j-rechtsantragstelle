import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularRechtsschutzversicherungPages } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/pages";
import { type ProzesskostenhilfeRechtsschutzversicherungUserData } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/userData";
import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/types";
import { rechtsschutzversicherungDone } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularRechtsschutzversicherungPages,
);

export function getProzesskostenhilfeRsvXstateConfig(
  transitions?: FlowConfigTransitions,
): Config<ProzesskostenhilfeRechtsschutzversicherungUserData> {
  const nextFlowEntrypoint = Array.isArray(transitions?.nextFlowEntrypoint)
    ? transitions.nextFlowEntrypoint
    : [transitions?.nextFlowEntrypoint];
  return {
    id: "rechtsschutzversicherung",
    initial: steps.rsvFrage.relative,
    meta: { done: rechtsschutzversicherungDone },
    states: {
      [steps.rsvFrage.relative]: {
        on: {
          BACK: transitions?.backToCallingFlow,
          SUBMIT: [
            {
              guard: ({ context }) => context.hasRsv === "yes",
              target: steps.rsvDeckung.relative,
            },
            steps.orgFrage.relative,
          ],
        },
      },
      [steps.rsvDeckung.relative]: {
        on: {
          BACK: steps.rsvFrage.relative,
          SUBMIT: [
            {
              guard: ({ context }) => context.hasRsvCoverage === "yes",
              target: steps.rsvDeckungJa.relative,
            },
            {
              guard: ({ context }) => context.hasRsvCoverage === "partly",
              target: steps.rsvDeckungTeilweise.relative,
            },
            {
              guard: ({ context }) => context.hasRsvCoverage === "no",
              target: steps.rsvDeckungNein.relative,
            },
            {
              guard: ({ context }) => context.hasRsvCoverage === "unknown",
              target: steps.rsvDeckungUnbekannt.relative,
            },
          ],
        },
      },
      [steps.rsvDeckungJa.relative]: {
        on: {
          BACK: steps.rsvDeckung.relative,
        },
      },
      [steps.rsvDeckungUnbekannt.relative]: {
        on: {
          BACK: steps.rsvDeckung.relative,
        },
      },
      [steps.rsvDeckungNein.relative]: {
        on: {
          BACK: steps.rsvDeckung.relative,
          SUBMIT: steps.orgFrage.relative,
        },
      },
      [steps.rsvDeckungTeilweise.relative]: {
        on: {
          BACK: steps.rsvDeckung.relative,
          SUBMIT: steps.orgFrage.relative,
        },
      },
      [steps.orgFrage.relative]: {
        on: {
          BACK: [
            {
              guard: ({ context }) => context.hasRsvCoverage === "no",
              target: steps.rsvDeckungNein.relative,
            },
            {
              guard: ({ context }) => context.hasRsvCoverage === "partly",
              target: steps.rsvDeckungTeilweise.relative,
            },
            steps.rsvFrage.relative,
          ],
          SUBMIT: [
            {
              guard: ({ context }) => context.hasRsvThroughOrg === "yes",
              target: steps.orgDeckung.relative,
            },
            ...nextFlowEntrypoint,
          ],
        },
      },
      [steps.orgDeckung.relative]: {
        on: {
          BACK: steps.orgFrage.relative,
          SUBMIT: [
            {
              guard: ({ context }) => context.hasOrgCoverage === "yes",
              target: steps.orgDeckungJa.relative,
            },
            {
              guard: ({ context }) => context.hasOrgCoverage === "partly",
              target: steps.orgDeckungTeilweise.relative,
            },
            {
              guard: ({ context }) => context.hasOrgCoverage === "no",
              target: steps.orgDeckungNein.relative,
            },
            {
              guard: ({ context }) => context.hasOrgCoverage === "unknown",
              target: steps.orgDeckungUnbekannt.relative,
            },
          ],
        },
      },
      [steps.orgDeckungJa.relative]: {
        on: {
          BACK: steps.orgDeckung.relative,
        },
      },
      [steps.orgDeckungUnbekannt.relative]: {
        on: {
          BACK: steps.orgDeckung.relative,
        },
      },
      [steps.orgDeckungNein.relative]: {
        on: {
          BACK: steps.orgDeckung.relative,
          SUBMIT: nextFlowEntrypoint,
        },
      },
      [steps.orgDeckungTeilweise.relative]: {
        on: {
          BACK: steps.orgDeckung.relative,
          SUBMIT: nextFlowEntrypoint,
        },
      },
    },
  };
}
