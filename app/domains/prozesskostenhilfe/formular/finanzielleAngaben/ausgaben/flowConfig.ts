import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { arrayIsNonEmpty } from "~/util/array";
import { hasAusgabenYes, hasVersicherungenYes, hasRatenzahlungenYes, hasSonstigeAusgabenYes } from "../guards";
import { pkhFormularFinanzielleAngabenAusgabenPages } from "./pages";

export const ausgabenFlowConfig = {
  ausgabenFrage: [
    {
      guard: (data) => hasAusgabenYes({ context: data }),
      target: "ausgabenVersicherungenFrage",
    },
    {
      target: "ausgabenBesondereBelastungen",
    },
  ],
  ausgabenVersicherungenFrage: [
    {
      guard: (data) => hasVersicherungenYes({ context: data }),
      target: "ausgabenVersicherungenUebersicht",
    },
    {
      target: "ausgabenRatenzahlungenFrage",
    },
  ],
  ausgabenVersicherungenUebersicht: [
    {
      type: "addArrayItem",
      target: "ausgabenVersicherung",
    },
    {
      guard: (data) =>
        hasVersicherungenYes({ context: data }) &&
        !arrayIsNonEmpty(data.versicherungen),
      target: "ausgabenVersicherungenWarnung",
    },
    {
      target: "ausgabenRatenzahlungenFrage",
    },
  ],
  ausgabenVersicherungenWarnung: "ausgabenRatenzahlungenFrage",
  ausgabenRatenzahlungenFrage: [
    {
      guard: (data) => hasRatenzahlungenYes({ context: data }),
      target: "ausgabenRatenzahlungenUebersicht",
    },
    {
      target: "ausgabenSonstigeAusgabenFrage",
    },
  ],
  ausgabenRatenzahlungenUebersicht: [
    {
      type: "addArrayItem",
      target: "ausgabenRatenzahlung",
    },
    {
      guard: (data) =>
        hasRatenzahlungenYes({ context: data }) &&
        !arrayIsNonEmpty(data.ratenzahlungen),
      target: "ausgabenRatenzahlungenWarnung",
    },
    {
      target: "ausgabenSonstigeAusgabenFrage",
    },
  ],
  ausgabenRatenzahlungenWarnung: "ausgabenSonstigeAusgabenFrage",
  ausgabenSonstigeAusgabenFrage: [
    {
      guard: (data) => hasSonstigeAusgabenYes({ context: data }),
      target: "ausgabenSonstigeAusgabenUebersicht",
    },
    {
      target: "ausgabenBesondereBelastungen",
    },
  ],
  ausgabenSonstigeAusgabenUebersicht: [
    {
      type: "addArrayItem",
      target: "ausgabenSonstigeAusgabe",
    },
    {
      guard: (data) =>
        hasSonstigeAusgabenYes({ context: data }) &&
        !arrayIsNonEmpty(data.sonstigeAusgaben),
      target: "ausgabenSonstigeAusgabenWarnung",
    },
    {
      target: "ausgabenBesondereBelastungen",
    },
  ],
  ausgabenSonstigeAusgabenWarnung: "ausgabenBesondereBelastungen",
  ausgabenBesondereBelastungen: null,
} satisfies Partial<
  TransitionConfigMap<typeof pkhFormularFinanzielleAngabenAusgabenPages>
>;