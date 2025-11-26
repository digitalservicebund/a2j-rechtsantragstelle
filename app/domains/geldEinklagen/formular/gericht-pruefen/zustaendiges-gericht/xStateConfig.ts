import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import {
  type TransitionConfigOrTarget,
  type Config,
} from "~/services/flow/server/types";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "../gericht-suchen/guards";
import { getPilotCourts } from "~/domains/geldEinklagen/services/court/getPilotCourts";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

const backButtonGerichtSuchenFlow: TransitionConfigOrTarget<GeldEinklagenFormularGerichtPruefenUserData> =
  [
    {
      guard: ({ context: { postleitzahlSecondary } }) =>
        edgeCasesForPlz(postleitzahlSecondary).length > 0,
      target: steps.gerichtSuchenStrasseNummer.absolute,
    },
    {
      guard: ({ context: { postleitzahlBeklagtePerson } }) =>
        edgeCasesForPlz(postleitzahlBeklagtePerson).length > 0,
      target: steps.gerichtSuchenStrasseNummerBeklagtePerson.absolute,
    },
    {
      guard: shouldVisitGerichtSuchenPostleitzahlWohnraum,
      target: steps.gerichtSuchenPostleitzahlWohnraum.absolute,
    },
    {
      guard: ({ context }) => context.gerichtsstandsvereinbarung === "yes",
      target:
        steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung.absolute,
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
      target: steps.gerichtSuchenPostleitzahlUnerlaubtePerson.absolute,
    },
    {
      target: steps.gerichtSuchenPostleitzahlBeklagtePerson.absolute,
    },
  ];

export const zustaendigesGerichtXstateConfig = {
  id: "zustaendiges-gericht",
  initial: "pilot-gericht",
  states: {
    [steps.zustaendigesGerichtPilotGericht.relative]: {
      always: [
        {
          guard: ({ context }) => getPilotCourts(context).length === 0,
          target: "ergebnis/gericht-abbruch",
        },
        {
          guard: ({ context }) => getPilotCourts(context).length === 2,
          target: steps.zustaendigesGerichtPilotGerichtAuswahl.relative,
        },
        {
          target: steps.zustaendigesGerichtPilotGericht.relative,
        },
      ],
      on: {
        BACK: [...backButtonGerichtSuchenFlow],
        SUBMIT: "#klage-erstellen.intro.start",
      },
    },
    [steps.zustaendigesGerichtPilotGerichtAuswahl.relative]: {
      on: {
        BACK: backButtonGerichtSuchenFlow,
        SUBMIT: steps.zustaendigesGerichtPilotGericht.relative,
      },
    },
    "ergebnis/gericht-abbruch": {
      on: {
        BACK: backButtonGerichtSuchenFlow,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
