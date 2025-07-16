import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";

const finanzielleAngabenEigentumInfo =
  "/finanzielle-angaben/eigentum/eigentum-info";
const finanzielleAngabenEigentumBankkontenFrage =
  "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage";
const finanzielleAngabenEigentumGeldanlagenFrage =
  "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage";
const finanzielleAngabenEigentumWertgegenstaendeFrage =
  "/finanzielle-angaben/eigentum/wertgegenstaende-frage";
const finanzielleAngabenEigentumGrundeigentumFrage =
  "/finanzielle-angaben/eigentum/grundeigentum-frage";
const finanzielleAngabenEigentumKraftfahrzeugeFrage =
  "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage";
const finanzielleAngabenAusgabenAusgabenFrage =
  "/finanzielle-angaben/ausgaben/ausgaben-frage";

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentum = [
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
      bankkonten: [
        {
          kontoEigentuemer: "myself",
          kontostand: "1000",
          bankName: "Bank1",
          iban: "DE123456789",
        },
      ],
      hasGeldanlage: "no",
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
    ],
  ],
  [
    {
      hasBankkonto: "yes",
    },
    [
      "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
      "/finanzielle-angaben/eigentum/bankkonten/warnung",
    ],
  ],
  [
    {
      hasGeldanlage: "yes",
    },
    [
      "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
      "/finanzielle-angaben/eigentum/geldanlagen/warnung",
    ],
  ],
  [
    {
      hasBankkonto: "no",
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "bargeld" }],
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
      eigentumTotalWorth: "more10000",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      "/finanzielle-angaben/eigentum/gesamtwert",
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
    ],
  ],
  [
    {
      hasBankkonto: "no",
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "bargeld" }],
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
      eigentumTotalWorth: "less10000",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      "/finanzielle-angaben/eigentum/gesamtwert",
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
    ],
  ],
  // TODO: remove me after eigentum-zusammenfassung is removed
  [
    {
      hasKraftfahrzeug: "yes",
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/eigentum-zusammenfassung/warnung",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngabenUserData>;
