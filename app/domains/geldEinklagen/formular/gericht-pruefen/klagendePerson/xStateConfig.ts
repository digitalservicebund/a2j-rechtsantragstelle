import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const klagendePersonXstateConfig = {
  id: "klagende-person",
  initial: "fuer-wen",
  meta: { done: () => false },
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
              context.besondere === "schaden" ||
              context.besondere === "verkehrsunfall",
            target: steps.klagendePersonKaufmann.relative,
          },
          { target: steps.klagendePersonVerbraucher.relative },
        ],
        BACK: [
          {
            guard: ({ context }) =>
              context.besondere === "anderesRechtsproblem" ||
              context.besondere === "schaden" ||
              context.besondere === "urheberrecht",
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
            target: steps.sachgebietVersicherungVersicherungsnummer.absolute,
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
              context.besondere === "miete" &&
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
              context.besondere === "miete" &&
              context.mietePachtVertrag === "yes" &&
              context.mietePachtRaum === "no",
            target: steps.klagendePersonHaustuergeschaeft.relative,
          },
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "yes" &&
              context.besondere === "versicherung" &&
              context.versicherungVertrag === "yes" &&
              context.versicherungsnummer === "no",
            target: steps.klagendePersonHaustuergeschaeft.relative,
          },
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "yes" &&
              (context.besondere === "reisen" ||
                context.besondere === "urheberrecht" ||
                context.besondere === "anderesRechtsproblem"),
            target: steps.klagendePersonVertrag.relative,
          },
          steps.beklagtePerson.absolute,
        ],
        BACK: steps.klagendePersonFuerWen.relative,
      },
    },
    [steps.klagendePersonKaufmann.relative]: {
      on: {
        SUBMIT: steps.beklagtePerson.absolute,
        BACK: [
          {
            guard: ({ context }) =>
              context.besondere === "schaden" ||
              context.besondere === "verkehrsunfall",
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
          { target: steps.beklagtePerson.absolute },
        ],
        BACK: steps.klagendePersonVerbraucher.relative,
      },
    },
    [steps.klagendePersonHaustuergeschaeft.relative]: {
      on: {
        SUBMIT: steps.beklagtePerson.absolute,
        BACK: [
          {
            guard: ({ context }) =>
              context.besondere === "reisen" ||
              context.besondere === "urheberrecht" ||
              context.besondere === "anderesRechtsproblem",
            target: steps.klagendePersonVertrag.relative,
          },
          { target: steps.klagendePersonVerbraucher.relative },
        ],
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
