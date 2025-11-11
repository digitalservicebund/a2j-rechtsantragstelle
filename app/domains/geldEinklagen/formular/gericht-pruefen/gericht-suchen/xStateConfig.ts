import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import {
  shouldVisitGerichtSuchePostleitzahlKlagendePerson,
  shouldVisitGerichtSuchePostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchePostleitzahlWohnraum,
} from "./guards";
import { doneGerichtSuchen } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const gerichtSuchenXstateConfig = {
  id: "gericht-suchen",
  initial: "check-initial-page",
  states: {
    "check-initial-page": {
      always: [
        {
          guard: ({ context }) => context.gerichtsstandsvereinbarung === "yes",
          target:
            steps.gerichtSuchePostleitzahlGerichtsstandsvereinbarung.relative,
        },
        {
          guard: shouldVisitGerichtSuchePostleitzahlWohnraum,
          target: steps.gerichtSuchePostleitzahlWohnraum.relative,
        },
        {
          target: steps.gerichtSuchePostleitzahlBeklagtePerson.relative,
        },
      ],
    },
    [steps.gerichtSuchePostleitzahlBeklagtePerson.relative]: {
      on: {
        SUBMIT: [
          {
            guard: shouldVisitGerichtSuchePostleitzahlKlagendePerson,
            target: steps.gerichtSuchePostleitzahlKlagendePerson.relative,
          },
          {
            guard: shouldVisitGerichtSuchePostleitzahlVerkehrsunfall,
            target: steps.gerichtSuchePostleitzahlVerkehrsunfall.relative,
          },
          {
            guard: ({ context }) => context.sachgebiet === "schaden",
            target: steps.gerichtSuchePostleitzahlUnerlaubtePerson.relative,
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
    [steps.gerichtSuchePostleitzahlKlagendePerson.relative]: {
      on: {
        BACK: steps.gerichtSuchePostleitzahlBeklagtePerson.relative,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
    [steps.gerichtSuchePostleitzahlVerkehrsunfall.relative]: {
      on: {
        BACK: steps.gerichtSuchePostleitzahlBeklagtePerson.relative,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
    [steps.gerichtSuchePostleitzahlUnerlaubtePerson.relative]: {
      on: {
        BACK: steps.gerichtSuchePostleitzahlBeklagtePerson.relative,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
    [steps.gerichtSuchePostleitzahlWohnraum.relative]: {
      on: {
        BACK: steps.beklagtePersonGegenWen.absolute,
        SUBMIT: {
          guard: doneGerichtSuchen,
          target: steps.zustaendigesGerichtPilotGericht.absolute,
        },
      },
    },
    [steps.gerichtSuchePostleitzahlGerichtsstandsvereinbarung.relative]: {
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
