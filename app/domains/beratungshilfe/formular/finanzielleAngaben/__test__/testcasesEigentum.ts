import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";

const finanzielleAngabenEigentumInfo =
  "/finanzielle-angaben/eigentum/eigentum-info";
const finanzielleAngabenEigentumBankkontenFrage =
  "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage";
const finanzielleAngabenEigentumGeldanlagenFrage =
  "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage";
const finanzielleAngabenEigentumKraftfahrzeugeFrage =
  "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage";
const finanzielleAngabenEigentumWertgegenstaendeFrage =
  "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage";
const finanzielleAngabenEigentumGrundeigentumFrage =
  "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage";
const finanzielleAngabenAusgabenAusgabenFrage =
  "/finanzielle-angaben/ausgaben/ausgaben-frage";

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentum = [
  [
    {},
    [
      finanzielleAngabenEigentumInfo,
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
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
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
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
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
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
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
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
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenAusgabenAusgabenFrage,
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
      hasWertsache: "yes",
    },
    [
      "/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
      "/finanzielle-angaben/eigentum/wertgegenstaende/warnung",
    ],
  ],
  [
    {
      hasGrundeigentum: "yes",
    },
    [
      "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
      "/finanzielle-angaben/eigentum/grundeigentum/warnung",
    ],
  ],
  [
    {
      hasKraftfahrzeug: "yes",
    },
    [
      "/finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
      "/finanzielle-angaben/eigentum/kraftfahrzeuge/warnung",
    ],
  ],
  [
    {
      hasBankkonto: "no",
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "bargeld", wert: "100", eigentuemer: "myself" }],
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenAusgabenAusgabenFrage,
    ],
  ],
  [
    {
      hasBankkonto: "no",
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "bargeld", wert: "100", eigentuemer: "myself" }],
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
    },
    [
      finanzielleAngabenEigentumBankkontenFrage,
      finanzielleAngabenEigentumGeldanlagenFrage,
      "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
      finanzielleAngabenEigentumKraftfahrzeugeFrage,
      finanzielleAngabenEigentumWertgegenstaendeFrage,
      finanzielleAngabenEigentumGrundeigentumFrage,
      finanzielleAngabenAusgabenAusgabenFrage,
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngabenUserData>;
