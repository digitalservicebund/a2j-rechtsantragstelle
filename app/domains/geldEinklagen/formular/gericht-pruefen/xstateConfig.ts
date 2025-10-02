import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { geldEinklagenGerichtPruefenPages } from "./pages";
import { forderungDone } from "./doneFunctions";
import { sachgebietXstateConfig } from "./sachgebiet/xstateConfig";
import { klagendePersonXstateConfig } from "./klagendePerson/xStateConfig";

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
    "klagende-person": klagendePersonXstateConfig,
    "beklagte-person": {
      id: "beklagte-person",
      initial: "fuer-wen",
      meta: { done: () => false },
      states: {
        [steps.beklagtePerson.relative]: {
          on: {
            BACK: [
              {
                guard: ({ context }) =>
                  context.klagendeVerbraucher === "yes" &&
                  (context.besondere === "anderesRechtsproblem" ||
                    context.besondere === "urheberrecht" ||
                    context.besondere === "reisen") &&
                  context.klagendeVertrag === "no",
                target: steps.klagendePersonVertrag.absolute,
              },
              {
                guard: ({ context }) =>
                  context.klagendeVerbraucher === "yes" &&
                  (context.besondere === "anderesRechtsproblem" ||
                    context.besondere === "urheberrecht" ||
                    context.besondere === "reisen") &&
                  context.klagendeVertrag === "yes",
                target: steps.klagendePersonHaustuergeschaeft.absolute,
              },
              {
                guard: ({ context }) =>
                  context.klagendeVerbraucher === "yes" &&
                  context.besondere === "versicherung" &&
                  context.versicherungVertrag === "yes" &&
                  context.versicherungsnummer === "no",
                target: steps.klagendePersonHaustuergeschaeft.absolute,
              },
              {
                guard: ({ context }) =>
                  context.klagendeVerbraucher === "yes" &&
                  context.besondere === "miete" &&
                  context.mietePachtVertrag === "yes" &&
                  context.mietePachtRaum === "no",
                target: steps.klagendePersonHaustuergeschaeft.absolute,
              },
              {
                guard: ({ context }) => context.klagendeVerbraucher === "yes",
                target: steps.klagendePersonVerbraucher.absolute,
              },
              {
                guard: ({ context }) =>
                  context.klagendeVerbraucher === "no" &&
                  context.besondere === "miete" &&
                  context.mietePachtVertrag === "yes" &&
                  context.mietePachtRaum === "yes",
                target: steps.klagendePersonVerbraucher.absolute,
              },
              {
                guard: ({ context }) =>
                  context.klagendeVerbraucher === "no" ||
                  context.besondere === "verkehrsunfall" ||
                  context.besondere === "schaden",
                target: steps.klagendePersonKaufmann.absolute,
              },
            ],
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
