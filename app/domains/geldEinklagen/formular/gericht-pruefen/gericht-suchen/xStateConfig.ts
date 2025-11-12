import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "./guards";
import { doneGerichtSuchen } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const gerichtSuchenXstateConfig = {
  id: "gericht-suchen",
  initial: "postleitzahl-beklagte-person",
  states: {
    [steps.gerichtSuchenPostleitzahlBeklagtePerson.relative]: {
      always: [
        {
          guard: ({ context }) => context.gerichtsstandsvereinbarung === "yes",
          target:
            steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung.relative,
        },
        {
          guard: shouldVisitGerichtSuchenPostleitzahlWohnraum,
          target: steps.gerichtSuchenPostleitzahlWohnraum.relative,
        },
        {
          target: steps.gerichtSuchenPostleitzahlBeklagtePerson.relative,
        },
      ],
      on: {
        SUBMIT: [
          {
            guard: shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
            target: steps.gerichtSuchenPostleitzahlKlagendePerson.relative,
          },
          {
            guard: shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
            target: steps.gerichtSuchenPostleitzahlVerkehrsunfall.relative,
          },
          {
            guard: ({ context }) => context.sachgebiet === "schaden",
            target: steps.gerichtSuchenPostleitzahlUnerlaubtePerson.relative,
          },
          {
            guard: doneGerichtSuchen,
            target: steps.zustaendigesGerichtPilotGericht.absolute,
          },
        ],
        BACK: [
          {
            guard: ({ context }) =>
              context.gegenWenBeklagen === "person" &&
              context.sachgebiet === "urheberrecht" &&
              context.beklagtePersonGeldVerdienen === "no",
            target: steps.beklagtePersonGeldVerdienen.absolute,
          },
          {
            guard: ({ context }) =>
              context.gegenWenBeklagen === "person" &&
              context.sachgebiet === "urheberrecht" &&
              context.beklagtePersonGeldVerdienen === "yes" &&
              context.klagendeKaufmann !== "yes",
            target: steps.beklagtePersonGeldVerdienen.absolute,
          },
          {
            guard: ({ context }) => context.beklagtePersonKaufmann === "yes",
            target: steps.beklagtePersonGerichtsstandsvereinbarung.absolute,
          },
          {
            guard: ({ context }) =>
              context.beklagtePersonKaufmann === "no" ||
              context.beklagtePersonKaufmann === "unknown",
            target: steps.beklagtePersonKaufmann.absolute,
          },
          { target: steps.beklagtePersonGegenWen.absolute },
        ],
      },
    },
    [steps.gerichtSuchenPostleitzahlKlagendePerson.relative]: {
      on: {
        BACK: steps.gerichtSuchenPostleitzahlBeklagtePerson.relative,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
    [steps.gerichtSuchenPostleitzahlVerkehrsunfall.relative]: {
      on: {
        BACK: steps.gerichtSuchenPostleitzahlBeklagtePerson.relative,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
    [steps.gerichtSuchenPostleitzahlUnerlaubtePerson.relative]: {
      on: {
        BACK: steps.gerichtSuchenPostleitzahlBeklagtePerson.relative,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
    [steps.gerichtSuchenPostleitzahlWohnraum.relative]: {
      on: {
        BACK: steps.beklagtePersonGegenWen.absolute,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
    [steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung.relative]: {
      on: {
        BACK: steps.beklagtePersonGerichtsstandsvereinbarung.absolute,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
