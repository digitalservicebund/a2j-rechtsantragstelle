import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngaben } from "~/domains/beratungshilfe/formular/finanzielleAngaben/context";

const finanzielleAngabenEigentumInfo =
  "/finanzielle-angaben/eigentum/eigentum-info";
const finanzielleAngabenEigentumBankkontenFrage =
  "/finanzielle-angaben/eigentum/bankkonten-frage";
const finanzielleAngabenEigentumGeldanlagenFrage =
  "/finanzielle-angaben/eigentum/geldanlagen-frage";
const finanzielleAngabenEigentumWertgegenstaendeFrage =
  "/finanzielle-angaben/eigentum/wertgegenstaende-frage";
const finanzielleAngabenEigentumGrundeigentumFrage =
  "/finanzielle-angaben/eigentum/grundeigentum-frage";
const finanzielleAngabenEigentumKraftfahrzeugeFrage =
  "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage";
const finanzielleAngabenAusgabenAusgabenFrage =
  "/finanzielle-angaben/ausgaben/ausgaben-frage";
const cases = [
  [
    {},
    [
      finanzielleAngabenEigentumInfo,
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenAusgabenAusgabenFrage,
    ],
  ],
  [
    {
      partnerschaft: "yes",
    },
    [
      finanzielleAngabenEigentumInfo,
      "/finanzielle-angaben/eigentum/heirat-info",
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenAusgabenAusgabenFrage,
    ],
  ],
  [
    {
      partnerschaft: "yes",
      staatlicheLeistungen: "asylbewerberleistungen",
    },
    [
      finanzielleAngabenEigentumInfo,
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      staatlicheLeistungen: "keine",
    },
    [
      finanzielleAngabenEigentumInfo,
      "/finanzielle-angaben/eigentum/heirat-info",
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenAusgabenAusgabenFrage,
    ],
  ],
  [
    {
      hasBankkonto: "yes",
      hasGeldanlage: "no",
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/eigentum-zusammenfassung/warnung",
    ],
  ],
  [
    {
      hasBankkonto: "no",
      hasGeldanlage: "yes",
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
      eigentumTotalWorth: "more10000",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      "/finanzielle-angaben/eigentum/gesamtwert",
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/eigentum-zusammenfassung/warnung",
    ],
  ],
  [
    {
      hasBankkonto: "no",
      hasGeldanlage: "yes",
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
      eigentumTotalWorth: "less10000",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      "/finanzielle-angaben/eigentum/gesamtwert",
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentum = {
  machine,
  cases,
};
