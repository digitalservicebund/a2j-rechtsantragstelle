import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const sachgebietXstateConfig = {
  id: "sachgebiet",
  initial: "info",
  meta: { done: () => false },
  states: {
    [steps.sachgebietInfo.relative]: {
      on: {
        SUBMIT: steps.sachgebietAusgeschlossen.relative,
        BACK: steps.forderungFragen.absolute,
      },
    },
    [steps.sachgebietAusgeschlossen.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.sachgebietAusgeschlossen === "yes",
            target: "ergebnis/sachgebiet-abbruch",
          },
          {
            target: steps.sachgebietBesondere.relative,
          },
        ],
        BACK: steps.sachgebietInfo.relative,
      },
    },
    [steps.sachgebietBesondere.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.besondere === "anderesRechtsproblem" ||
              context.besondere === "schaden",
            target: steps.klagendePersonFuerWen.absolute,
          },
          {
            guard: ({ context }) => context.besondere === "miete",
            target: steps.sachgebietMietePachtVertrag.relative,
          },
          {
            guard: ({ context }) => context.besondere === "versicherung",
            target: steps.sachgebietVersicherungVertrag.relative,
          },
          {
            guard: ({ context }) => context.besondere === "reisen",
            target: steps.sachgebietReiseArt.relative,
          },
          {
            guard: ({ context }) => context.besondere === "verkehrsunfall",
            target: steps.sachgebietVerkehrsunfallStrassenverkehr.relative,
          },
        ],
        BACK: steps.sachgebietAusgeschlossen.relative,
      },
    },
    [steps.sachgebietMietePachtVertrag.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.mietePachtVertrag === "yes",
            target: steps.sachgebietMietePachtRaum.relative,
          },
          steps.klagendePersonFuerWen.absolute,
        ],
        BACK: steps.sachgebietBesondere.relative,
      },
    },
    [steps.sachgebietMietePachtRaum.relative]: {
      on: {
        SUBMIT: steps.klagendePersonFuerWen.absolute,
        BACK: steps.sachgebietMietePachtVertrag.relative,
      },
    },
    [steps.sachgebietVersicherungVertrag.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.versicherungVertrag === "yes",
            target: steps.sachgebietVersicherungVersicherungsnummer.relative,
          },
          steps.klagendePersonFuerWen.absolute,
        ],
        BACK: steps.sachgebietBesondere.relative,
      },
    },
    [steps.sachgebietVersicherungVersicherungsnummer.relative]: {
      on: {
        SUBMIT: steps.klagendePersonFuerWen.absolute,
        BACK: steps.sachgebietVersicherungVertrag.relative,
      },
    },
    [steps.sachgebietReiseArt.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.reiseArt === "flug",
            target: steps.sachgebietReiseStopp.relative,
          },
          steps.klagendePersonFuerWen.absolute,
        ],
        BACK: steps.sachgebietBesondere.relative,
      },
    },
    [steps.sachgebietReiseStopp.relative]: {
      on: {
        BACK: steps.sachgebietReiseArt.relative,
      },
    },
    [steps.sachgebietVerkehrsunfallStrassenverkehr.relative]: {
      on: {
        SUBMIT: steps.klagendePersonFuerWen.absolute,
        BACK: steps.sachgebietBesondere.relative,
      },
    },
    "ergebnis/sachgebiet-abbruch": {
      on: {
        BACK: steps.sachgebietAusgeschlossen.relative,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
