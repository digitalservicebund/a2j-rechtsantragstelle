import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const beklagtePersonXstateConfig = {
  id: "beklagte-person",
  initial: "fuer-wen",
  meta: { done: () => false },
  states: {
    [steps.beklagtePersonFuerWen.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.fuerWenBeklagen === "person" &&
              context.sachgebiet === "urheberrecht",
            target: steps.beklagtePersonGeldVerdienen.relative,
          },
          {
            guard: ({ context }) =>
              context.fuerWenBeklagen === "person" &&
              context.sachgebiet === "miete" &&
              context.mietePachtRaum === "no" &&
              context.klagendeKaufmann === "yes",
            target: steps.beklagtePersonKaufmann.relative,
          },
          { target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute },
        ],
        BACK: [
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "yes" &&
              (context.sachgebiet === "anderesRechtsproblem" ||
                context.sachgebiet === "urheberrecht" ||
                context.sachgebiet === "reisen") &&
              context.klagendeVertrag === "no",
            target: steps.klagendePersonVertrag.absolute,
          },
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "yes" &&
              (context.sachgebiet === "anderesRechtsproblem" ||
                context.sachgebiet === "urheberrecht" ||
                context.sachgebiet === "reisen") &&
              context.klagendeVertrag === "yes",
            target: steps.klagendePersonHaustuergeschaeft.absolute,
          },
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "yes" &&
              context.sachgebiet === "miete" &&
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
              context.sachgebiet === "miete" &&
              context.mietePachtVertrag === "yes" &&
              context.mietePachtRaum === "yes",
            target: steps.klagendePersonVerbraucher.absolute,
          },
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "no" ||
              context.sachgebiet === "verkehrsunfall" ||
              context.sachgebiet === "schaden" ||
              context.sachgebiet === "versicherung",
            target: steps.klagendePersonKaufmann.absolute,
          },
        ],
      },
    },
    [steps.beklagtePersonGeldVerdienen.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.beklagtePersonGeldVerdienen === "yes" &&
              context.klagendeKaufmann === "yes",
            target: steps.beklagtePersonKaufmann.relative,
          },
          {
            target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute,
          },
        ],
        BACK: steps.beklagtePersonFuerWen.relative,
      },
    },
    [steps.beklagtePersonKaufmann.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.beklagtePersonKaufmann === "yes",
            target: steps.beklagtePersonGerichtsstandsvereinbarung.relative,
          },
          {
            target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute,
          },
        ],
        BACK: [
          {
            guard: ({ context }) =>
              context.beklagtePersonGeldVerdienen !== undefined,
            target: steps.beklagtePersonGeldVerdienen.relative,
          },
          steps.beklagtePersonFuerWen.relative,
        ],
      },
    },
    [steps.beklagtePersonGerichtsstandsvereinbarung.relative]: {
      on: {
        SUBMIT: {
          target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute,
        },
        BACK: steps.beklagtePersonKaufmann.relative,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
