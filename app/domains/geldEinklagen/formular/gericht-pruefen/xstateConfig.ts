import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { geldEinklagenGerichtPruefenPages } from "./pages";
import { forderungDone } from "./doneFunctions";
import { sachgebietXstateConfig } from "./sachgebiet/xstateConfig";
import { klagendePersonXstateConfig } from "./klagendePerson/xStateConfig";
import { beklagtePersonXstateConfig } from "./beklagtePerson/xStateConfig";
import { gerichtSuchenXstateConfig } from "./gericht-suchen/xStateConfig";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

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
    "gericht-suche": gerichtSuchenXstateConfig,
    "zustaendiges-gericht": {
      id: "zustaendiges-gericht",
      initial: "pilot-gericht",
      states: {
        [steps.zustaendigesGerichtPilotGericht.relative]: {
          on: {
            BACK: [
              {
                guard: ({ context }) =>
                  context.sachgebiet === "miete" &&
                  context.mietePachtVertrag === "yes" &&
                  context.mietePachtRaum === "yes",
                target: steps.gerichtSuchePostleitzahlWohnraum.absolute,
              },
              {
                guard: ({ context }) =>
                  context.gerichtsstandsvereinbarung === "yes",
                target:
                  steps.gerichtSuchePostleitzahlGerichtsstandsvereinbarung
                    .absolute,
              },
              {
                guard: ({ context }) => context.sachgebiet === "schaden",
              },
              {
                guard: ({ context }) =>
                  context.sachgebiet === "verkehrsunfall" &&
                  context.verkehrsunfallStrassenverkehr === "yes" &&
                  objectKeysNonEmpty(context, ["postleitzahlSecondary"]),
              },
              { target: steps.gerichtSuchePostleitzahlBeklagtePerson.absolute },
            ],
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
