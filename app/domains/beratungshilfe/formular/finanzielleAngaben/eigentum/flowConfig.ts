import { z } from "zod";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../../pages";
import {
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kraftfahrzeugeArraySchema,
  wertsachenArraySchema,
} from "./pages";
import {
  grundeigentumIsBewohnt,
  hasGrundeigentumYes,
  hasKraftfahrzeugYes,
  hasPartnerschaftYesAndNoStaatlicheLeistungen,
  hasWertsacheYes,
  isGeldanlageBargeld,
  isGeldanlageBefristet,
  isGeldanlageForderung,
  isGeldanlageGiroTagesgeldSparkonto,
  isGeldanlageGuthabenkontoKrypto,
  isGeldanlageSonstiges,
  isGeldanlageWertpapiere,
  isKraftfahrzeugWertAbove10000OrUnsure,
  staatlicheLeistungenIsBuergergeld,
} from "../guards";

export const eigentumFlowConfig = {
  eigentumInfo: [
    {
      guard: (context) =>
        hasPartnerschaftYesAndNoStaatlicheLeistungen({ context }),
      target: "eigentumHeiratInfo",
    },
    { target: "eigentumBankkontenFrage" },
  ],
  eigentumHeiratInfo: "eigentumBankkontenFrage",
  eigentumBankkontenFrage: [
    {
      guard: (context) => context.hasBankkonto === "yes",
      target: "eigentumBankkontenUebersicht",
    },
    { target: "eigentumGeldanlagenFrage" },
  ],
  eigentumBankkontenUebersicht: [
    { type: "addArrayItem", target: "eigentumBankkonto" },
    {
      guard: (context) =>
        !z.validate(bankkontenArraySchema, context.bankkonten),
      target: "eigentumBankkontoWarnung",
    },
    { target: "eigentumGeldanlagenFrage" },
  ],
  eigentumBankkontoWarnung: "eigentumGeldanlagenFrage",
  eigentumBankkonto: "eigentumBankkontenUebersicht",
  eigentumGeldanlagenFrage: [
    {
      guard: (context) => context.hasGeldanlage === "yes",
      target: "eigentumGeldanlagenUebersicht",
    },
    { target: "eigentumKraftfahrzeugeFrage" },
  ],
  eigentumGeldanlagenUebersicht: [
    { type: "addArrayItem", target: "eigentumGeldanlageArt" },
    {
      guard: (context) =>
        !z.validate(geldanlagenArraySchema, context.geldanlagen),
      target: "eigentumGeldanlagenWarnung",
    },
    { target: "eigentumKraftfahrzeugeFrage" },
  ],
  eigentumGeldanlagenWarnung: "eigentumKraftfahrzeugeFrage",
  eigentumGeldanlageArt: [
    {
      guard: (context) => isGeldanlageBargeld({ context }),
      target: "eigentumGeldanlageBargeld",
    },
    {
      guard: (context) => isGeldanlageWertpapiere({ context }),
      target: "eigentumGeldanlageWertpapiere",
    },
    {
      guard: (context) => isGeldanlageGuthabenkontoKrypto({ context }),
      target: "eigentumGeldanlageGuthabenkontoKrypto",
    },
    {
      guard: (context) => isGeldanlageGiroTagesgeldSparkonto({ context }),
      target: "eigentumGeldanlageGiroTagesgeldSparkonto",
    },
    {
      guard: (context) => isGeldanlageBefristet({ context }),
      target: "eigentumGeldanlageBefristet",
    },
    {
      guard: (context) => isGeldanlageForderung({ context }),
      target: "eigentumGeldanlageForderung",
    },
    {
      guard: (context) => isGeldanlageSonstiges({ context }),
      target: "eigentumGeldanlageSonstiges",
    },
    { target: "eigentumGeldanlagenUebersicht" },
  ],
  eigentumGeldanlageBargeld: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageWertpapiere: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageGuthabenkontoKrypto: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageGiroTagesgeldSparkonto: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageBefristet: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageForderung: "eigentumGeldanlagenUebersicht",
  eigentumGeldanlageSonstiges: "eigentumGeldanlagenUebersicht",
  eigentumKraftfahrzeugeFrage: [
    {
      guard: (context) => hasKraftfahrzeugYes({ context }),
      target: "eigentumKraftfahrzeugeUebersicht",
    },
    { target: "eigentumWertgegenstaendeFrage" },
  ],
  eigentumKraftfahrzeugeUebersicht: [
    { type: "addArrayItem", target: "eigentumKraftfahrzeugArbeitsweg" },
    {
      guard: (context) =>
        !z.validate(kraftfahrzeugeArraySchema, context.kraftfahrzeuge),
      target: "eigentumKraftfahrzeugeWarnung",
    },
    { target: "eigentumWertgegenstaendeFrage" },
  ],
  eigentumKraftfahrzeugeWarnung: "eigentumWertgegenstaendeFrage",
  eigentumKraftfahrzeugArbeitsweg: "eigentumKraftfahrzeugWert",
  eigentumKraftfahrzeugWert: [
    {
      guard: (context) => isKraftfahrzeugWertAbove10000OrUnsure({ context }),
      target: "eigentumKraftfahrzeugFahrzeuge",
    },
    { target: "eigentumKraftfahrzeugeUebersicht" },
  ],
  eigentumKraftfahrzeugFahrzeuge: "eigentumKraftfahrzeugeUebersicht",
  eigentumWertgegenstaendeFrage: [
    {
      guard: (context) => hasWertsacheYes({ context }),
      target: "eigentumWertgegenstaendeUebersicht",
    },
    { target: "eigentumGrundeigentumFrage" },
  ],
  eigentumWertgegenstaendeUebersicht: [
    { type: "addArrayItem", target: "eigentumWertgegenstand" },
    {
      guard: (context) =>
        !z.validate(wertsachenArraySchema, context.wertsachen),
      target: "eigentumWertgegenstaendeWarnung",
    },
    { target: "eigentumGrundeigentumFrage" },
  ],
  eigentumWertgegenstaendeWarnung: "eigentumGrundeigentumFrage",
  eigentumWertgegenstand: "eigentumWertgegenstaendeUebersicht",
  eigentumGrundeigentumFrage: [
    {
      guard: (context) => hasGrundeigentumYes({ context }),
      target: "eigentumGrundeigentumUebersicht",
    },
    {
      guard: (context) => staatlicheLeistungenIsBuergergeld({ context }),
      target: "persoenlicheDatenStart",
    },
    { target: "ausgabenFrage" },
  ],
  eigentumGrundeigentumUebersicht: [
    { type: "addArrayItem", target: "eigentumGrundeigentumBewohntFrage" },
    {
      guard: (context) =>
        !z.validate(grundeigentumArraySchema, context.grundeigentum),
      target: "eigentumGrundeigentumWarnung",
    },
    {
      guard: (context) => staatlicheLeistungenIsBuergergeld({ context }),
      target: "persoenlicheDatenStart",
    },
    { target: "ausgabenFrage" },
  ],
  eigentumGrundeigentumWarnung: [
    {
      guard: (context) => staatlicheLeistungenIsBuergergeld({ context }),
      target: "persoenlicheDatenStart",
    },
    { target: "ausgabenFrage" },
  ],
  eigentumGrundeigentumBewohntFrage: [
    {
      guard: (context) => grundeigentumIsBewohnt({ context }),
      target: "eigentumGrundeigentumBewohntDaten",
    },
    { target: "eigentumGrundeigentumDaten" },
  ],
  eigentumGrundeigentumBewohntDaten: "eigentumGrundeigentumUebersicht",
  eigentumGrundeigentumDaten: "eigentumGrundeigentumUebersicht",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
