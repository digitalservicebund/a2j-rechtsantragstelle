import type {
  InferredUserData,
  NodeKey,
  TransitionConfig,
  TransitionConfigMap,
} from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenGerichtPruefenPages } from "../pages";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitPilotGerichtAuswahl,
} from "../gericht-suchen/guards";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { getPilotCourts } from "~/domains/geldEinklagen/services/court/getPilotCourts";

const submitButtonZustaendigesGerichtFlow: TransitionConfig<
  NodeKey<GeldEinklagenGerichtPruefenPages>,
  InferredUserData<GeldEinklagenGerichtPruefenPages>
> = [
  {
    guard: (context) => getPilotCourts(context).length === 0,
    target: "zustaendigesGerichtGerichtAbbruch",
  },
  {
    guard: (context) =>
      shouldVisitPilotGerichtAuswahl({ context }) &&
      getPilotCourts(context).length === 2,
    target: "zustaendigesGerichtPilotGerichtAuswahl",
  },
  {
    target: "zustaendigesGerichtPilotGericht",
  },
];

export const gerichtPruefenGerichtSuchenFlowConfig = {
  gerichtSuchenPostleitzahlBeklagtePerson: [
    {
      guard: (context) =>
        edgeCasesForPlz(context.postleitzahlBeklagtePerson).length > 0,
      target: "gerichtSuchenStrasseNummerBeklagtePerson",
    },
    {
      guard: (context) =>
        shouldVisitGerichtSuchenPostleitzahlKlagendePerson({ context }),
      target: "gerichtSuchenPostleitzahlKlagendePerson",
    },
    {
      guard: (context) =>
        shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({ context }),
      target: "gerichtSuchenPostleitzahlVerkehrsunfall",
    },
    {
      guard: (context) => context.sachgebiet === "schaden",
      target: "gerichtSuchenPostleitzahlUnerlaubtePerson",
    },
    ...submitButtonZustaendigesGerichtFlow,
  ],
  gerichtSuchenStrasseNummerBeklagtePerson: [
    {
      guard: (context) =>
        shouldVisitGerichtSuchenPostleitzahlKlagendePerson({ context }),
      target: "gerichtSuchenPostleitzahlKlagendePerson",
    },
    {
      guard: (context) =>
        shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({ context }),
      target: "gerichtSuchenPostleitzahlVerkehrsunfall",
    },
    {
      guard: (context) => context.sachgebiet === "schaden",
      target: "gerichtSuchenPostleitzahlUnerlaubtePerson",
    },
    ...submitButtonZustaendigesGerichtFlow,
  ],
  gerichtSuchenPostleitzahlWohnraum: [
    {
      guard: (context) =>
        edgeCasesForPlz(context.postleitzahlSecondary).length > 0,
      target: "gerichtSuchenStrasseNummer",
    },
    ...submitButtonZustaendigesGerichtFlow,
  ],
  gerichtSuchenPostleitzahlKlagendePerson: [
    {
      guard: (context) =>
        edgeCasesForPlz(context.postleitzahlSecondary).length > 0,
      target: "gerichtSuchenStrasseNummer",
    },
    ...submitButtonZustaendigesGerichtFlow,
  ],
  gerichtSuchenPostleitzahlUnerlaubtePerson: [
    {
      guard: (context) =>
        edgeCasesForPlz(context.postleitzahlSecondary).length > 0,
      target: "gerichtSuchenStrasseNummer",
    },
    ...submitButtonZustaendigesGerichtFlow,
  ],
  gerichtSuchenPostleitzahlVerkehrsunfall: [
    {
      guard: (context) =>
        edgeCasesForPlz(context.postleitzahlSecondary).length > 0,
      target: "gerichtSuchenStrasseNummer",
    },
    ...submitButtonZustaendigesGerichtFlow,
  ],
  gerichtSuchenPostleitzahlGerichtsstandsvereinbarung: [
    {
      guard: (context) =>
        edgeCasesForPlz(context.postleitzahlSecondary).length > 0,
      target: "gerichtSuchenStrasseNummer",
    },
    ...submitButtonZustaendigesGerichtFlow,
  ],
  gerichtSuchenStrasseNummer: submitButtonZustaendigesGerichtFlow,
} satisfies Partial<TransitionConfigMap<GeldEinklagenGerichtPruefenPages>>;
