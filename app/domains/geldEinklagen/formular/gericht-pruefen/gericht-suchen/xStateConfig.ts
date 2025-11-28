import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type {
  TransitionConfigOrTarget,
  Config,
} from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "./guards";
import { doneGerichtSuchen } from "./doneFunctions";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { getPilotCourts } from "~/domains/geldEinklagen/services/court/getPilotCourts";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

const submitButtonZustaendigesGerichtFlow: TransitionConfigOrTarget<GeldEinklagenFormularGerichtPruefenUserData> =
  [
    {
      guard: ({ context }) =>
        getPilotCourts(context).length === 0 && doneGerichtSuchen({ context }),
      target: "#zustaendiges-gericht.ergebnis/gericht-abbruch",
    },
    {
      guard: ({ context }) =>
        getPilotCourts(context).length === 2 && doneGerichtSuchen({ context }),
      target: steps.zustaendigesGerichtPilotGerichtAuswahl.absolute,
    },
    {
      guard: doneGerichtSuchen,
      target: steps.zustaendigesGerichtPilotGericht.absolute,
    },
  ];

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
            guard: ({ context: { postleitzahlBeklagtePerson } }) =>
              edgeCasesForPlz(postleitzahlBeklagtePerson).length > 0,
            target: steps.gerichtSuchenStrasseNummerBeklagtePerson.relative,
          },
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
          ...submitButtonZustaendigesGerichtFlow,
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
    [steps.gerichtSuchenStrasseNummerBeklagtePerson.relative]: {
      on: {
        BACK: steps.gerichtSuchenPostleitzahlBeklagtePerson.relative,
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
          ...submitButtonZustaendigesGerichtFlow,
        ],
      },
    },
    [steps.gerichtSuchenPostleitzahlKlagendePerson.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context: { postleitzahlBeklagtePerson } }) =>
              edgeCasesForPlz(postleitzahlBeklagtePerson).length > 0,
            target: steps.gerichtSuchenStrasseNummerBeklagtePerson.relative,
          },
          steps.gerichtSuchenPostleitzahlBeklagtePerson.relative,
        ],
        SUBMIT: [
          {
            guard: ({ context: { postleitzahlSecondary } }) =>
              edgeCasesForPlz(postleitzahlSecondary).length > 0,
            target: steps.gerichtSuchenStrasseNummer.relative,
          },
          ...submitButtonZustaendigesGerichtFlow,
        ],
      },
    },
    [steps.gerichtSuchenPostleitzahlVerkehrsunfall.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context: { postleitzahlBeklagtePerson } }) =>
              edgeCasesForPlz(postleitzahlBeklagtePerson).length > 0,
            target: steps.gerichtSuchenStrasseNummerBeklagtePerson.relative,
          },
          steps.gerichtSuchenPostleitzahlBeklagtePerson.relative,
        ],
        SUBMIT: [
          {
            guard: ({ context: { postleitzahlSecondary } }) =>
              edgeCasesForPlz(postleitzahlSecondary).length > 0,
            target: steps.gerichtSuchenStrasseNummer.relative,
          },
          ...submitButtonZustaendigesGerichtFlow,
        ],
      },
    },
    [steps.gerichtSuchenPostleitzahlUnerlaubtePerson.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context: { postleitzahlBeklagtePerson } }) =>
              edgeCasesForPlz(postleitzahlBeklagtePerson).length > 0,
            target: steps.gerichtSuchenStrasseNummerBeklagtePerson.relative,
          },
          steps.gerichtSuchenPostleitzahlBeklagtePerson.relative,
        ],
        SUBMIT: [
          {
            guard: ({ context: { postleitzahlSecondary } }) =>
              edgeCasesForPlz(postleitzahlSecondary).length > 0,
            target: steps.gerichtSuchenStrasseNummer.relative,
          },
          ...submitButtonZustaendigesGerichtFlow,
        ],
      },
    },
    [steps.gerichtSuchenPostleitzahlWohnraum.relative]: {
      on: {
        BACK: steps.beklagtePersonGegenWen.absolute,
        SUBMIT: [
          {
            guard: ({ context: { postleitzahlSecondary } }) =>
              edgeCasesForPlz(postleitzahlSecondary).length > 0,
            target: steps.gerichtSuchenStrasseNummer.relative,
          },
          ...submitButtonZustaendigesGerichtFlow,
        ],
      },
    },
    [steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung.relative]: {
      on: {
        BACK: steps.beklagtePersonGerichtsstandsvereinbarung.absolute,
        SUBMIT: [
          {
            guard: ({ context: { postleitzahlSecondary } }) =>
              edgeCasesForPlz(postleitzahlSecondary).length > 0,
            target: steps.gerichtSuchenStrasseNummer.relative,
          },
          ...submitButtonZustaendigesGerichtFlow,
        ],
      },
    },
    [steps.gerichtSuchenStrasseNummer.relative]: {
      on: {
        BACK: [
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
            guard: shouldVisitGerichtSuchenPostleitzahlWohnraum,
            target: steps.gerichtSuchenPostleitzahlWohnraum.relative,
          },
          {
            guard: ({ context }) =>
              context.gerichtsstandsvereinbarung === "yes",
            target:
              steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung
                .relative,
          },
        ],
        SUBMIT: submitButtonZustaendigesGerichtFlow,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
