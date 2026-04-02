import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type {
  TransitionConfigOrTarget,
  Config,
} from "~/services/flow/server/types";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import {
  shouldVisitPilotGerichtAuswahl,
  shouldVisitGerichtSuchenGerichtsstandsvereinbarung,
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "./guards";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { getPilotCourts } from "~/domains/geldEinklagen/services/court/getPilotCourts";
import { type GeldEinklagenFormularUserData } from "../../userData";
import { type GenericGuard } from "~/domains/guards.server";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

type GeldEinklagenDaten = GenericGuard<GeldEinklagenFormularUserData>;

const isGerichtSuchenDone: GeldEinklagenDaten = ({ context }) => {
  return (
    context.pageData?.subflowDoneStates?.["/gericht-pruefen/gericht-suchen"] ===
    true
  );
};

const submitButtonZustaendigesGerichtFlow: TransitionConfigOrTarget<GeldEinklagenFormularUserData> =
  [
    {
      guard: ({ context }) =>
        getPilotCourts(context).length === 0 &&
        isGerichtSuchenDone({ context }),
      target: "#zustaendiges-gericht.ergebnis/gericht-abbruch",
    },
    {
      guard: ({ context }) =>
        shouldVisitPilotGerichtAuswahl({ context }) &&
        getPilotCourts(context).length === 2 &&
        isGerichtSuchenDone({ context }),
      target: steps.zustaendigesGerichtPilotGerichtAuswahl.absolute,
    },
    {
      guard: isGerichtSuchenDone,
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
          guard: shouldVisitGerichtSuchenGerichtsstandsvereinbarung,
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
            guard: shouldVisitGerichtSuchenGerichtsstandsvereinbarung,
            target:
              steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung
                .relative,
          },
        ],
        SUBMIT: submitButtonZustaendigesGerichtFlow,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularUserData>;
