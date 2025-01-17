import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";

export const testCasesPKHFormularFinanzielleAngabenEigentum = [
  [
    { rentsApartment: "yes" },
    [
      "/finanzielle-angaben/wohnung/nebenkosten",
      "/finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
  [
    { partnerschaft: "yes" },
    [
      "/finanzielle-angaben/eigentum/eigentum-info",
      "/finanzielle-angaben/eigentum/heirat-info",
      "/finanzielle-angaben/eigentum/bankkonten-frage",
    ],
  ],
  [
    {
      hasBankkonto: "no",
      hasGeldanlage: "no",
      hasWertsache: "no",
      hasGrundeigentum: "no",
      hasKraftfahrzeug: "no",
    },
    [
      "/finanzielle-angaben/eigentum/eigentum-info",
      "/finanzielle-angaben/eigentum/bankkonten-frage",
      "/finanzielle-angaben/eigentum/geldanlagen-frage",
      "/finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "/finanzielle-angaben/eigentum/grundeigentum-frage",
      "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
    ],
  ],
  [
    {
      hasBankkonto: "yes",
      hasGeldanlage: "no",
      hasWertsache: "no",
      hasGrundeigentum: "no",
      hasKraftfahrzeug: "no",
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/eigentum-zusammenfassung/warnung",
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
    ],
  ],
  [
    {
      geldanlagen: [{ art: "bargeld" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/bargeld",
    ],
  ],
  [
    {
      geldanlagen: [{ art: "wertpapiere" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/wertpapiere",
    ],
  ],
  [
    {
      geldanlagen: [{ art: "guthabenkontoKrypto" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/guthabenkonto-krypto",
    ],
  ],
  [
    {
      geldanlagen: [{ art: "giroTagesgeldSparkonto" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/giro-tagesgeld-sparkonto",
    ],
  ],
  [
    {
      geldanlagen: [{ art: "befristet" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/befristet",
    ],
  ],
  [
    {
      geldanlagen: [{ art: "forderung" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/forderung",
    ],
  ],
  [
    {
      geldanlagen: [{ art: "sonstiges" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/sonstiges",
    ],
  ],
  [
    {
      kraftfahrzeuge: [{ wert: "over10000" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/arbeitsweg",
      "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/wert",
      "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/fahrzeuge",
    ],
  ],
  [
    {
      grundeigentum: [{ isBewohnt: "yes" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage",
      "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-daten",
    ],
  ],
  [
    {
      grundeigentum: [{ isBewohnt: "no" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage",
      "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/daten",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;
