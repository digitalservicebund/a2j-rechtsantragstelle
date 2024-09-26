import type { Context } from "~/flows/contexts";
import type { GenericGuard } from "~/flows/guards.server";
import type { Config } from "~/services/flow/server/buildFlowController";
import type { ProzesskostenhilfePersoenlicheDaten } from "./context";

export function getProzesskostenhilfePersoenlicheDatenXstateConfig(transitions?: {
  backToCallingFlow?:
    | string
    | (string | { guard: GenericGuard<Context>; target: string })[];
  nextFlowEntrypoint?: string;
}): Config<ProzesskostenhilfePersoenlicheDaten> {
  return {
    id: "persoenliche-daten",
    initial: "start",
    states: {
      start: {
        on: {
          SUBMIT: "name",
          BACK: transitions?.backToCallingFlow,
        },
      },
      name: {
        on: {
          BACK: "start",
          SUBMIT: "geburtsdatum",
        },
      },
      geburtsdatum: {
        on: {
          BACK: "name",
          SUBMIT: "adresse",
        },
      },
      adresse: {
        on: {
          BACK: "geburtsdatum",
          SUBMIT: "telefonnummer",
        },
      },
      telefonnummer: {
        on: {
          SUBMIT: "beruf",
          BACK: "adresse",
        },
      },
      beruf: {
        on: {
          BACK: "telefonnummer",
          SUBMIT: transitions?.nextFlowEntrypoint,
        },
      },
    },
  };
}
