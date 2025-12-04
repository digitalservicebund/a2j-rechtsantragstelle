import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import { beklagtePersonDone } from "./doneFunctions";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import {
  shouldVisitGerichtSuchenGerichtsstandsvereinbarung,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "../gericht-suchen/guards";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const beklagtePersonXstateConfig = {
  id: "beklagte-person",
  initial: "gegen-wen",
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
              context.sachgebiet === "miete" &&
              (context.mietePachtRaum === "no" ||
                context.mietePachtVertrag === "no") &&
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
            guard: ({ context }) =>
              objectKeysNonEmpty(context, ["gegenWenBeklagen"]) &&
              shouldVisitGerichtSuchenPostleitzahlWohnraum({ context }),
            target: steps.gerichtSuchenPostleitzahlWohnraum.absolute,
          },
          {
            guard: beklagtePersonDone,
            target: steps.gerichtSuchenPostleitzahlBeklagtePerson.absolute,
          },
        ],
        BACK: [
          {
            guard: ({ context }) =>
              context.sachgebiet === "miete" &&
              context.mietePachtVertrag === "yes" &&
              context.mietePachtRaum === "yes",
            target: steps.klagendePersonFuerWen.absolute,
          },
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
              context.sachgebiet === "miete",
            target: steps.klagendePersonHaustuergeschaeft.absolute,
          },
          {
            guard: ({ context }) => context.klagendeVerbraucher === "yes",
            target: steps.klagendePersonVerbraucher.absolute,
          },
          {
            guard: ({ context }) =>
              context.klagendeVerbraucher === "no" ||
              context.sachgebiet === "verkehrsunfall" ||
              context.sachgebiet === "schaden" ||
              context.sachgebiet === "versicherung" ||
              (context.sachgebiet === "miete" &&
                context.mietePachtVertrag === "no"),
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
            target: steps.gerichtSuchenPostleitzahlBeklagtePerson.absolute,
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
            target: steps.gerichtSuchenPostleitzahlBeklagtePerson.absolute,
          },
        ],
        BACK: [
          {
            guard: ({ context }) =>
              objectKeysNonEmpty(context, ["beklagtePersonGeldVerdienen"]),
            target: steps.beklagtePersonGeldVerdienen.relative,
          },
          steps.beklagtePersonGegenWen.relative,
        ],
      },
    },
    [steps.beklagtePersonGerichtsstandsvereinbarung.relative]: {
      on: {
        SUBMIT: [
          {
            guard: shouldVisitGerichtSuchenGerichtsstandsvereinbarung,
            target:
              steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung
                .absolute,
          },
          {
            guard: beklagtePersonDone,
            target: steps.gerichtSuchenPostleitzahlBeklagtePerson.absolute,
          },
        ],
        BACK: steps.beklagtePersonKaufmann.relative,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
