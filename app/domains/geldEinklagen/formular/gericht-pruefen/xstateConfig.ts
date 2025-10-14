import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { geldEinklagenGerichtPruefenPages } from "./pages";
import { forderungDone } from "./doneFunctions";
import { sachgebietXstateConfig } from "./sachgebiet/xstateConfig";
import { klagendePersonXstateConfig } from "./klagendePerson/xStateConfig";
import { beklagtePersonXstateConfig } from "./beklagtePerson/xStateConfig";

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
    "beklagte-person": beklagtePersonXstateConfig,
    "gericht-suche": {
      id: "gericht-suche",
      initial: "postleitzahl-beklagte-person",
      meta: { done: () => false },
      states: {
        [steps.gerichtSuchePostleitzahlBeklagtePerson.relative]: {
          on: {
            BACK: [
              {
                guard: ({ context }) =>
                  context.fuerWenBeklagen === "person" &&
                  context.besondere === "urheberrecht" &&
                  context.beklagtePersonGeldVerdienen === "no",
                target: steps.beklagtePersonGeldVerdienen.absolute,
              },
              {
                guard: ({ context }) =>
                  context.beklagtePersonKaufmann === "yes",
                target: steps.beklagtePersonGerichtsstandsvereinbarung.absolute,
              },
              {
                guard: ({ context }) =>
                  context.beklagtePersonKaufmann === "no" ||
                  context.beklagtePersonKaufmann === "unknown",
                target: steps.beklagtePersonKaufmann.absolute,
              },
              { target: steps.beklagtePersonFuerWen.absolute },
            ],
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
