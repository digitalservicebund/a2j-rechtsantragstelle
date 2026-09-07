import { compileFlow, CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { PageConfigMap, TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { hasGrundeigentumYes, hasKraftfahrzeugYes, hasPartnerschaftYes, hasWeitereUnterhaltszahlungenYesAndEmptyArray, hasWertsacheYes, isGeldanlageBargeld } from "../guards";
import { pkhFormularFinanzielleAngabenEigentumPages } from "./pages";
import { arrayIsNonEmpty } from "~/util/array";

export const eigentumFlowConfig = {
  eigentumInfo: [
    {
      guard: (data) => hasPartnerschaftYes({ context: data }),
      target: "eigentumHeiratInfo",
    },
    {
      target: "eigentumBankkontenFrage",
    },
  ],
  eigentumHeiratInfo: "eigentumBankkontenFrage",
  eigentumBankkontenFrage: [
    {
      guard: (data) => data.hasBankkonto === "yes",
      target: "eigentumBankkontenUebersicht",
    },
    {
      target: "eigentumGeldanlagenFrage",
    },
  ],
  eigentumBankkontenUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumBankkonto",
    },
    {
      guard: (data) =>
        data.hasBankkonto === "yes" &&
        !arrayIsNonEmpty(data.bankkonten),
      target: "eigentumBankkontoWarnung",
    },
    {
      target: "eigentumGeldanlagen",
    },
  ],
  eigentumBankkontoWarnung: "eigentumGeldanlagen",
  eigentumGeldanlagenFrage: [
    {
      guard: (data) => data.hasGeldanlage === "yes",
      target: "eigentumGeldanlagenUebersicht",
    },
    {
      target: "eigentumKraftfahrzeugeFrage",
    },
  ],
  eigentumGeldanlagenUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumGeldanlage",
    },
    {
      guard: (data) =>
        data.hasGeldanlage === "yes" &&
        !arrayIsNonEmpty(data.geldanlagen),
      target: "eigentumGeldanlagenWarnung",
    },
    {
      target: "eigentumKraftfahrzeugeFrage",
    },
  ],
  eigentumGeldanlagenWarnung: "eigentumKraftfahrzeugeFrage",
  eigentumGeldanlage: [
    {
      guard: (data) => isGeldanlageBargeld({ context: data }),
      target: "eigentumGeldanlage",
    },
  ],
  eigentumKraftfahrzeugeFrage: [
    {
      guard: (data) => hasKraftfahrzeugYes({ context: data }),
      target: "eigentumKraftfahrzeugeUebersicht",
    },
    {
      target: "eigentumWertgegenstaendeFrage",
    },
  ],
  eigentumKraftfahrzeugeUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumKraftfahrzeug",
    },
    {
      guard: (data) =>
        hasKraftfahrzeugYes({ context: data }) &&
        !arrayIsNonEmpty(data.kraftfahrzeuge),
      target: "eigentumKraftfahrzeugeWarnung",
    },
    {
      target: "eigentumWertgegenstaendeFrage",
    },
  ],
  eigentumKraftfahrzeugeWarnung: "eigentumWertgegenstaendeFrage",
  eigentumWertgegenstaendeFrage: [
    {
      guard: (data) => hasWertsacheYes({ context: data }),
      target: "eigentumWertgegenstaendeUebersicht",
    },
    {
      target: "eigentumGrundeigentumFrage",
    },
  ],

  eigentumWertgegenstaendeUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumWertgegenstand",
    },
    {
      guard: (data) =>
        hasWertsacheYes({ context: data }) &&
        !arrayIsNonEmpty(data.wertsachen),
      target: "eigentumWertgegenstaendeWarnung",
    },
    {
      target: "eigentumGrundeigentumFrage",
    },
  ],
  eigentumWertgegenstaendeWarnung: "eigentumGrundeigentumFrage",
  eigentumGrundeigentumFrage: [
    {
      guard: (data) => hasGrundeigentumYes({ context: data }),
      target: "eigentumGrundeigentumUebersicht",
    },
    {
      target: null,
    },
  ],
  eigentumGrundeigentumUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumGrundeigentum",
    },
    {
      guard: (data) =>
        hasGrundeigentumYes({ context: data }) &&
        !arrayIsNonEmpty(data.grundeigentum),
      target: "eigentumGrundeigentumWarnung",
    },
    {
      target: null,
    },
  ],
  eigentumGrundeigentumWarnung: null,
} satisfies Partial<
  TransitionConfigMap<typeof pkhFormularFinanzielleAngabenEigentumPages>
>;