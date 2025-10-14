import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import { klagendePersonDone } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const klagendePersonXstateConfig = {
  id: "klagende-person",
  initial: "fuer-wen",
  meta: { done: klagendePersonDone },
  states: {
    [steps.klagendePersonFuerWen.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.fuerWenKlagen === "organisation",
            target: "ergebnis/abbruch",
          },
          {
            guard: ({ context }) =>
              context.sachgebiet === "schaden" ||
              context.sachgebiet === "verkehrsunfall" ||
              context.sachgebiet === "versicherung",
            target: steps.klagendePersonKaufmann.relative,
          },
          { target: steps.klagendePersonVerbraucher.relative },
        ],
        BACK: [
          {
            guard: ({ context }) =>
              context.sachgebiet === "anderesRechtsproblem" ||
              context.sachgebiet === "schaden" ||
              context.sachgebiet === "urheberrecht",
            target: steps.sachgebietBesondere.absolute,
          },
          {
            guard: ({ context }) =>
              context.sachgebiet === "miete" &&
              context.mietePachtVertrag === "yes",
            target: steps.sachgebietMietePachtRaum.absolute,
          },
          {
            guard: ({ context }) =>
              context.sachgebiet === "miete" &&
              context.mietePachtVertrag === "no",
            target: steps.sachgebietMietePachtVertrag.absolute,
          },
          {
            guard: ({ context }) =>
              context.sachgebiet === "versicherung" &&
              context.versicherungVertrag === "no",
            target: steps.sachgebietVersicherungVertrag.absolute,
          },
          {
            guard: ({ context }) =>
              context.sachgebiet === "versicherung" &&
              context.versicherungVertrag === "yes",
            target: steps.sachgebietVersicherungVersicherungsnummer.absolute,
          },
          {
            guard: ({ context }) =>
              context.sachgebiet === "reisen" &&
              context.reiseArt === "andereReise",
            target: steps.sachgebietReiseArt.absolute,
          },
          {
            guard: ({ context }) => context.sachgebiet === "verkehrsunfall",
            target: steps.sachgebietVerkehrsunfallStrassenverkehr.absolute,
          },
        ],
      },
    },
    "ergebnis/abbruch": {
      on: {
        BACK: steps.klagendePersonFuerWen.relative,
      },
    },
    [steps.klagendePersonVerbraucher.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "no" &&
              context.sachgebiet === "miete" &&
              context.mietePachtVertrag === "yes" &&
              context.mietePachtRaum === "yes",
            target: steps.beklagtePerson.absolute,
          },
          {
            guard: ({ context }) => context.klagendeVerbraucher === "no",
            target: steps.klagendePersonKaufmann.relative,
          },
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "yes" &&
              context.sachgebiet === "miete" &&
              context.mietePachtVertrag === "yes" &&
              context.mietePachtRaum === "no",
            target: steps.klagendePersonHaustuergeschaeft.relative,
          },
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "yes" &&
              (context.sachgebiet === "reisen" ||
                context.sachgebiet === "urheberrecht" ||
                context.sachgebiet === "anderesRechtsproblem"),
            target: steps.klagendePersonVertrag.relative,
          },
          {
            guard: klagendePersonDone,
            target: steps.beklagtePerson.absolute,
          },
        ],
        BACK: steps.klagendePersonFuerWen.relative,
      },
    },
    [steps.klagendePersonKaufmann.relative]: {
      on: {
        SUBMIT: {
          guard: klagendePersonDone,
          target: steps.beklagtePerson.absolute,
        },
        BACK: [
          {
            guard: ({ context }) =>
              context.sachgebiet === "schaden" ||
              context.sachgebiet === "verkehrsunfall" ||
              context.sachgebiet === "versicherung",
            target: steps.klagendePersonFuerWen.relative,
          },
          { target: steps.klagendePersonVerbraucher.relative },
        ],
      },
    },
    [steps.klagendePersonVertrag.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.klagendeVertrag === "yes",
            target: steps.klagendePersonHaustuergeschaeft.relative,
          },
          {
            guard: klagendePersonDone,
            target: steps.beklagtePerson.absolute,
          },
        ],
        BACK: steps.klagendePersonVerbraucher.relative,
      },
    },
    [steps.klagendePersonHaustuergeschaeft.relative]: {
      on: {
        SUBMIT: {
          guard: klagendePersonDone,
          target: steps.beklagtePerson.absolute,
        },
        BACK: [
          {
            guard: ({ context }) =>
              context.sachgebiet === "reisen" ||
              context.sachgebiet === "urheberrecht" ||
              context.sachgebiet === "anderesRechtsproblem",
            target: steps.klagendePersonVertrag.relative,
          },
          { target: steps.klagendePersonVerbraucher.relative },
        ],
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
