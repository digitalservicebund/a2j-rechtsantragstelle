import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import {
  grundeigentumIsBewohnt,
  hasGrundeigentumYes,
  hasKraftfahrzeugYes,
  hasWertsacheYes,
  isGeldanlageBargeld,
  isGeldanlageBefristet,
  isGeldanlageForderung,
  isGeldanlageGiroTagesgeldSparkonto,
  isGeldanlageGuthabenkontoKrypto,
  isGeldanlageSonstiges,
  isGeldanlageWertpapiere,
  isKraftfahrzeugWertAbove10000OrUnsure,
} from "../guards";
import { arrayIsNonEmpty } from "~/util/array";

export const eigentumFlowConfig = {
  eigentumInfo: [
    {
      guard: (context) => context.partnerschaft === "yes",
      target: "eigentumHeiratInfo",
    },
    {
      target: "eigentumBankkontenFrage",
    },
  ],
  eigentumHeiratInfo: "eigentumBankkontenFrage",
  eigentumBankkonten: "eigentumBankkontenUebersicht",
  eigentumBankkontenFrage: [
    {
      guard: (context) => context.hasBankkonto === "yes",
      target: "eigentumBankkontenUebersicht",
    },
    {
      target: "eigentumGeldanlagen",
    },
  ],
  eigentumBankkontenUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumBankkonto",
    },
    {
      guard: (context) =>
        context.hasBankkonto === "yes" && !arrayIsNonEmpty(context.bankkonten),
      target: "eigentumBankkontoWarnung",
    },
    {
      target: "eigentumGeldanlagenFrage",
    },
  ],
  eigentumBankkonto: "eigentumBankkontenUebersicht",
  eigentumBankkontoWarnung: "eigentumGeldanlagenFrage",
  eigentumGeldanlagen: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlagenFrage: [
    {
      guard: (context) => context.hasGeldanlage === "yes",
      target: "eigentumGeldanlagenUebersicht",
    },
    {
      target: "eigentumKraftfahrzeugeFrage",
    },
  ],
  eigentumGeldanlagenUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumGeldanlageArt",
    },
    {
      guard: (context) => {
        const geldanlagen =
          (context as { geldanlagen?: unknown[] }).geldanlagen ?? [];
        return context.hasGeldanlage === "yes" && !arrayIsNonEmpty(geldanlagen);
      },
      target: "eigentumGeldanlagenWarnung",
    },
    {
      target: "eigentumKraftfahrzeugeFrage",
    },
  ],
  eigentumGeldanlagenWarnung: "eigentumKraftfahrzeugeFrage",
  eigentumGeldanlageArt: [
    {
      target: "eigentumGeldanlageBargeld",
      guard: (context) => isGeldanlageBargeld({ context }),
    },
    {
      target: "eigentumGeldanlageWertpapiere",
      guard: (context) => isGeldanlageWertpapiere({ context }),
    },
    {
      target: "eigentumGeldanlageGuthabenkontoKrypto",
      guard: (context) => isGeldanlageGuthabenkontoKrypto({ context }),
    },
    {
      target: "eigentumGeldanlageGiroTagesgeldSparkonto",
      guard: (context) => isGeldanlageGiroTagesgeldSparkonto({ context }),
    },
    {
      target: "eigentumGeldanlageBefristet",
      guard: (context) => isGeldanlageBefristet({ context }),
    },
    {
      target: "eigentumGeldanlageForderung",
      guard: (context) => isGeldanlageForderung({ context }),
    },
    {
      target: "eigentumGeldanlageSonstiges",
      guard: (context) => isGeldanlageSonstiges({ context }),
    },
  ],
  eigentumGeldanlageBargeld: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageWertpapiere: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageGuthabenkontoKrypto: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageGiroTagesgeldSparkonto: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageBefristet: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageForderung: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageSonstiges: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlage: "eigentumGeldanlagenUebersicht",
  eigentumKraftfahrzeugeFrage: [
    {
      guard: (context) => hasKraftfahrzeugYes({ context }),
      target: "eigentumKraftfahrzeugeUebersicht",
    },
    {
      target: "eigentumWertgegenstaendeFrage",
    },
  ],
  eigentumKraftfahrzeugeUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumKraftfahrzeugArbeitsweg",
    },
    {
      guard: (context) =>
        hasKraftfahrzeugYes({ context }) &&
        !arrayIsNonEmpty(context.kraftfahrzeuge),
      target: "eigentumKraftfahrzeugeWarnung",
    },
    { target: "eigentumWertgegenstaendeFrage" },
  ],
  eigentumKraftfahrzeug: "eigentumKraftfahrzeugeUebersicht",
  eigentumKraftfahrzeugArbeitsweg: "eigentumKraftfahrzeugWert",
  eigentumKraftfahrzeugWert: [
    {
      guard: (context) => isKraftfahrzeugWertAbove10000OrUnsure({ context }),
      target: "eigentumKraftfahrzeugFahrzeuge",
    },
    { target: "eigentumKraftfahrzeugeUebersicht" },
  ],
  eigentumKraftfahrzeugFahrzeuge: "eigentumKraftfahrzeugeUebersicht",
  eigentumKraftfahrzeugeWarnung: "eigentumWertgegenstaendeFrage",
  eigentumKraftfahrzeuge: "eigentumKraftfahrzeugeUebersicht",
  eigentumWertgegenstaende: "eigentumWertgegenstaendeUebersicht",
  eigentumWertgegenstaendeFrage: [
    {
      guard: (context) => hasWertsacheYes({ context }),
      target: "eigentumWertgegenstaendeUebersicht",
    },
    {
      target: "eigentumGrundeigentum",
    },
  ],
  eigentumWertgegenstaendeUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumWertgegenstand",
    },
    {
      guard: (context) =>
        hasWertsacheYes({ context }) &&
        !arrayIsNonEmpty((context as { wertsachen?: unknown[] }).wertsachen),
      target: "eigentumWertgegenstaendeWarnung",
    },
    { target: "eigentumGrundeigentumFrage" },
  ],
  eigentumWertgegenstand: "eigentumWertgegenstaendeUebersicht",
  eigentumWertgegenstaendeWarnung: "eigentumGrundeigentumFrage",
  eigentumGrundeigentum: "eigentumGrundeigentumUebersicht",
  eigentumGrundeigentumFrage: [
    {
      guard: (context) => hasGrundeigentumYes({ context }),
      target: "eigentumGrundeigentumUebersicht",
    },
    {
      target: "ausgabenFrage",
    },
  ],
  eigentumGrundeigentumUebersicht: [
    {
      type: "addArrayItem",
      target: "eigentumGrundeigentumBewohntFrage",
    },
    {
      guard: (context) =>
        hasGrundeigentumYes({ context }) &&
        !arrayIsNonEmpty(context.grundeigentum),
      target: "eigentumGrundeigentumWarnung",
    },
    { target: "ausgabenFrage" },
  ],
  eigentumGrundeigentumBewohntFrage: [
    {
      guard: (context) => grundeigentumIsBewohnt({ context }),
      target: "eigentumGrundeigentumBewohntDaten",
    },
    {
      target: "eigentumGrundeigentumUebersicht",
    },
  ],
  eigentumGrundeigentumBewohntDaten: "eigentumGrundeigentumUebersicht",
  eigentumGrundeigentumWarnung: "ausgabenFrage",
  eigentumGrundeigentumGrundeigentum: "eigentumGrundeigentumUebersicht",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
