import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import {
  hasAusgabenYes,
  hasRatenzahlungenYes,
  hasSonstigeAusgabenYes,
  hasVersicherungenYes,
  isSonstigeVersicherung,
  ratenzahlungAnteiligYes,
  sonstigeAusgabeAnteiligYes,
} from "../guards";
import { arrayIsNonEmpty } from "~/util/array";

export const ausgabenFlowConfig = {
  ausgabenFrage: [
    {
      guard: (context) => hasAusgabenYes({ context }),
      target: "ausgabenVersicherungenFrage",
    },
    {
      target: "ausgabenBesondereBelastungen",
    },
  ],
  ausgabenVersicherungenFrage: [
    {
      guard: (context) => hasVersicherungenYes({ context }),
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
      guard: (context) =>
        hasVersicherungenYes({ context }) &&
        !arrayIsNonEmpty(
          (context as { versicherungen?: unknown[] }).versicherungen,
        ),
      target: "ausgabenVersicherungenWarnung",
    },
    {
      target: "ausgabenRatenzahlungenFrage",
    },
  ],
  ausgabenVersicherungenWarnung: "ausgabenRatenzahlungenFrage",
  ausgabenVersicherung: [
    {
      guard: (context) => isSonstigeVersicherung({ context }),
      target: "ausgabenVersicherungSonstigeArt",
    },
    {
      target: "ausgabenVersicherungenUebersicht",
    },
  ],
  ausgabenVersicherungSonstigeArt: "ausgabenVersicherungenUebersicht",
  ausgabenRatenzahlung: null,
  ausgabenRatenzahlungenFrage: [
    {
      guard: (context) => hasRatenzahlungenYes({ context }),
      target: "ausgabenRatenzahlungenUebersicht",
    },
    {
      target: "ausgabenSonstigeAusgabenFrage",
    },
  ],
  ausgabenRatenzahlungenUebersicht: [
    {
      type: "addArrayItem",
      target: "ausgabenRatenzahlungZahlungspflichtiger",
    },
    {
      guard: (context) =>
        hasRatenzahlungenYes({ context }) &&
        !arrayIsNonEmpty(context.ratenzahlungen),
      target: "ausgabenRatenzahlungenWarnung",
    },
    {
      target: "ausgabenSonstigeAusgabenFrage",
    },
  ],
  ausgabenRatenzahlungenWarnung: "ausgabenSonstigeAusgabenFrage",
  ausgabenRatenzahlungZahlungspflichtiger: [
    {
      guard: (context: any) => ratenzahlungAnteiligYes({ context }),
      target: "ausgabenRatenzahlungBetragGemeinsamerAnteil",
    },
    { target: "ausgabenRatenzahlungBetragGesamt" },
  ],
  ausgabenRatenzahlungBetragGemeinsamerAnteil:
    "ausgabenRatenzahlungBetragEigenerAnteil",
  ausgabenRatenzahlungBetragEigenerAnteil: "ausgabenRatenzahlungRestschuld",
  ausgabenRatenzahlungBetragGesamt: "ausgabenRatenzahlungRestschuld",
  ausgabenRatenzahlungRestschuld: "ausgabenRatenzahlungLaufzeitende",
  ausgabenRatenzahlungLaufzeitende: "ausgabenRatenzahlungenUebersicht",
  ausgabenSonstigeAusgabenFrage: [
    {
      guard: (context) => hasSonstigeAusgabenYes({ context }),
      target: "ausgabenSonstigeAusgabenUebersicht",
    },
    {
      target: "ausgabenBesondereBelastungen",
    },
  ],
  ausgabenSonstigeAusgabenUebersicht: [
    {
      type: "addArrayItem",
      target: "ausgabenSonstigeAusgabenFrage",
    },
    {
      guard: (context) =>
        hasSonstigeAusgabenYes({ context }) &&
        !arrayIsNonEmpty(context.sonstigeAusgaben),
      target: "ausgabenSonstigeAusgabenWarnung",
    },
    {
      target: "ausgabenBesondereBelastungen",
    },
  ],
  ausgabenSonstigeAusgabenWarnung: "ausgabenBesondereBelastungen",
  ausgabenSonstigeAusgabe: null,
  ausgabenSonstigeAusgabeZahlungspflichtiger: [
    {
      guard: (context: any) => sonstigeAusgabeAnteiligYes({ context }),
      target: "ausgabenSonstigeAusgabeBetragGemeinsamerAnteil",
    },
    {
      target: "ausgabenSonstigeAusgabeBetragGesamt",
    },
  ],
  ausgabenSonstigeAusgabeBetragGemeinsamerAnteil:
    "ausgabenSonstigeAusgabeBetragEigenerAnteil",
  ausgabenSonstigeAusgabeBetragEigenerAnteil:
    "ausgabenSonstigeAusgabenUebersicht",
  ausgabenSonstigeAusgabeBetragGesamt: "ausgabenSonstigeAusgabenUebersicht",
  ausgabenBesondereBelastungen: "gesetzlicheVertretungFrage",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
