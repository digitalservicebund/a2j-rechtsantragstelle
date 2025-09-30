import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { geldEinklagenGerichtPruefenPages } from "./pages";
import { forderungDone } from "./doneFunctions";
import { sachgebietXstateConfig } from "./sachgebiet/xstateConfig";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const gerichtPruefenXstateConfig = {
  id: "gericht-pruefen",
  initial: "intro",
  states: {
    intro: {
      id: "intro",
      initial: "start",
      meta: { done: () => true },
      states: {
        [steps.introStart.relative]: {
          on: {
            SUBMIT: steps.forderungFragen.absolute,
          },
        },
      },
    },
    forderung: {
      id: "forderung",
      initial: "fragen",
      meta: { done: forderungDone },
      states: {
        [steps.forderungFragen.relative]: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => context.forderung === "etwasAnderes",
                target: "ergebnis/forderung-etwas-anderes",
              },
              { guard: forderungDone, target: steps.sachgebietInfo.absolute },
            ],
            BACK: steps.introStart.absolute,
          },
        },
        "ergebnis/forderung-etwas-anderes": {
          on: {
            BACK: steps.forderungFragen.relative,
          },
        },
      },
    },
    sachgebiet: sachgebietXstateConfig,
    "klagende-person": {
      id: "klagende-person",
      initial: "fuer-wen",
      meta: { done: () => false },
      states: {
        "fuer-wen": {
          on: {
            BACK: [
              {
                guard: ({ context }) =>
                  context.besondere === "anderesRechtsproblem" ||
                  context.besondere === "schaden",
                target: steps.sachgebietBesondere.absolute,
              },
              {
                guard: ({ context }) =>
                  context.besondere === "miete" &&
                  context.mietePachtVertrag === "yes",
                target: steps.sachgebietMietePachtRaum.absolute,
              },
              {
                guard: ({ context }) =>
                  context.besondere === "miete" &&
                  context.mietePachtVertrag === "no",
                target: steps.sachgebietMietePachtVertrag.absolute,
              },
              {
                guard: ({ context }) =>
                  context.besondere === "versicherung" &&
                  context.versicherungVertrag === "no",
                target: steps.sachgebietVersicherungVertrag.absolute,
              },
              {
                guard: ({ context }) =>
                  context.besondere === "versicherung" &&
                  context.versicherungVertrag === "yes",
                target:
                  steps.sachgebietVersicherungVersicherungsnummer.absolute,
              },
              {
                guard: ({ context }) =>
                  context.besondere === "reisen" &&
                  context.reiseArt === "andereReise",
                target: steps.sachgebietReiseArt.absolute,
              },
              {
                guard: ({ context }) => context.besondere === "verkehrsunfall",
                target: steps.sachgebietVerkehrsunfallStrassenverkehr.absolute,
              },
            ],
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
