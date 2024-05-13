import { machine } from "~/models/flows/beratungshilfeFormular/__test__/testMachine";
import type { TestCases } from "~/models/flows/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const finanzielleAngabenEigentumBankkontenFrage =
  "finanzielle-angaben/eigentum/bankkonten-frage";
const finanzielleAngabenEigentumGeldanlagenFrage =
  "finanzielle-angaben/eigentum/geldanlagen-frage";
const finanzielleAngabenEigentumWertgegenstaendeFrage =
  "finanzielle-angaben/eigentum/wertgegenstaende-frage";
const finanzielleAngabenEigentumGrundeigentumFrage =
  "finanzielle-angaben/eigentum/grundeigentum-frage";
const finanzielleAngabenEigentumKraftfahrzeugeFrage =
  "finanzielle-angaben/eigentum/kraftfahrzeuge-frage";
const finanzielleAngabenAusgabenAusgabenFrage =
  "finanzielle-angaben/ausgaben/ausgaben-frage";
const cases = [
  [
    {},
    [
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
    },
    [
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
      hasGeldanlage: "yes",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      "finanzielle-angaben/eigentum/gesamtwert",
      finanzielleAngabenAusgabenAusgabenFrage,
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
      "finanzielle-angaben/eigentum/gesamtwert",
      "finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentum = {
  machine,
  cases,
};
