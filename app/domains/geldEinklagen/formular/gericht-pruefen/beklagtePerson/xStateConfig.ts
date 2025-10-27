import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import { beklagtePersonDone } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const beklagtePersonXstateConfig = {
  id: "beklagte-person",
  initial: "gegen-wen",
  meta: { done: beklagtePersonDone },
  states: {
    [steps.beklagtePersonGegenWen.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.gegenWenBeklagen === "person" &&
              context.sachgebiet === "urheberrecht",
            target: steps.beklagtePersonGeldVerdienen.relative,
          },
          {
            guard: ({ context }) =>
              context.gegenWenBeklagen === "organisation" &&
              context.sachgebiet === "urheberrecht" &&
              context.klagendeKaufmann === "yes",
            target: steps.beklagtePersonKaufmann.relative,
          },
          {
            guard: ({ context }) =>
              (context.gegenWenBeklagen === "person" ||
                context.gegenWenBeklagen === "organisation") &&
              context.sachgebiet === "miete" &&
              context.mietePachtRaum === "no" &&
              context.klagendeKaufmann === "yes",
            target: steps.beklagtePersonKaufmann.relative,
          },
          {
            guard: ({ context }) =>
              context.sachgebiet !== "miete" &&
              context.sachgebiet !== "urheberrecht" &&
              context.klagendeKaufmann === "yes",
            target: steps.beklagtePersonKaufmann.relative,
          },
          {
            guard: beklagtePersonDone,
            target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute,
          },
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
            guard: beklagtePersonDone,
            target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute,
          },
        ],
        BACK: steps.beklagtePersonGegenWen.relative,
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
            guard: beklagtePersonDone,
            target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute,
          },
        ],
        BACK: [
          {
            guard: ({ context }) =>
              context.beklagtePersonGeldVerdienen !== undefined,
            target: steps.beklagtePersonGeldVerdienen.relative,
          },
          steps.beklagtePersonGegenWen.relative,
        ],
      },
    },
    [steps.beklagtePersonGerichtsstandsvereinbarung.relative]: {
      on: {
        SUBMIT: {
          guard: beklagtePersonDone,
          target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute,
        },
        BACK: steps.beklagtePersonKaufmann.relative,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
