import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import {
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
  eigentumBankkonten: [
    {
      guard: (context) =>
        context.hasBankkonto === "yes" && !arrayIsNonEmpty(context.bankkonten),
      target: "eigentumBankkontoWarnung",
    },
    { target: "eigentumGeldanlagen" },
  ],
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
      target: "eigentumGeldanlagen",
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
        const geldanlagen = (context as { geldanlagen?: unknown[] }).geldanlagen ?? [];
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
  eigentumKraftfahrzeuge: [],
  eigentumKraftfahrzeugeFrage: [
    {
      guard: (context) => hasKraftfahrzeugYes({ context }),
      target: "eigentumKraftfahrzeugeUebersicht",
    },
    {
      target: "eigentumWertgegenstaende",
    },
  ],
  eigentumKraftfahrzeugeUebersicht: [],
  eigentumKraftfahrzeug: "eigentumKraftfahrzeugeUebersicht",
  eigentumKraftfahrzeugeWarnung: "eigentumWertgegenstaende",
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
  eigentumWertgegenstaendeUebersicht: [],
  eigentumWertgegenstand: "eigentumWertgegenstaendeUebersicht",
  eigentumWertgegenstaendeWarnung: "eigentumGrundeigentum",
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
  eigentumGrundeigentumUebersicht: [],
  eigentumGrundeigentumGrundeigentum: [],
  eigentumGrundeigentumWarnung: "ausgabenFrage",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
