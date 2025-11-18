import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { geldEinklagenGerichtPruefenPages } from "./pages";
import { forderungDone } from "./doneFunctions";
import { sachgebietXstateConfig } from "./sachgebiet/xstateConfig";
import { klagendePersonXstateConfig } from "./klagendePerson/xStateConfig";
import { beklagtePersonXstateConfig } from "./beklagtePerson/xStateConfig";
import { gerichtSuchenXstateConfig } from "./gericht-suchen/xStateConfig";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "./gericht-suchen/guards";

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
            SUBMIT: steps.forderungWas.absolute,
          },
        },
      },
    },
    forderung: {
      id: "forderung",
      initial: "was",
      meta: { done: forderungDone },
      states: {
        [steps.forderungWas.relative]: {
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
            BACK: steps.forderungWas.relative,
          },
        },
      },
    },
    sachgebiet: sachgebietXstateConfig,
    "klagende-person": klagendePersonXstateConfig,
    "beklagte-person": beklagtePersonXstateConfig,
    "gericht-suchen": gerichtSuchenXstateConfig,
    "zustaendiges-gericht": {
      id: "zustaendiges-gericht",
      initial: "pilot-gericht",
      states: {
        [steps.zustaendigesGerichtPilotGericht.relative]: {
          on: {
            BACK: [
              {
                guard: shouldVisitGerichtSuchenPostleitzahlWohnraum,
                target: steps.gerichtSuchenPostleitzahlWohnraum.absolute,
              },
              {
                guard: ({ context }) =>
                  context.gerichtsstandsvereinbarung === "yes",
                target:
                  steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung
                    .absolute,
              },
              {
                guard: shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
                target: steps.gerichtSuchenPostleitzahlKlagendePerson.absolute,
              },
              {
                guard: shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
                target: steps.gerichtSuchenPostleitzahlVerkehrsunfall.absolute,
              },
              {
                guard: ({ context }) => context.sachgebiet === "schaden",
                target:
                  steps.gerichtSuchenPostleitzahlUnerlaubtePerson.absolute,
              },
              {
                target: steps.gerichtSuchenPostleitzahlBeklagtePerson.absolute,
              },
            ],
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
