import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { TestCases } from "~/domains/__test__/TestCases";
import { type KontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import { machine } from "./testMachine";

const cases = [
  [{}, ["/start", "/kontopfaendung", "/ergebnis/keine-kontopfaendung"]],
  [
    { hasKontopfaendung: "nein" },
    ["/start", "/kontopfaendung", "/ergebnis/keine-kontopfaendung"],
  ],
  [
    { hasKontopfaendung: "ja", hasPKonto: "nichtAktiv" },
    ["/kontopfaendung", "/p-konto", "/p-konto-probleme", "/glaeubiger"],
  ],
  // Glaeubiger
  [{}, ["/glaeubiger", "/sockelbetrag"]],
  [
    {
      schuldenBei: "privat",
    },
    ["/glaeubiger", "/pfaendung-unterhalt", "/sockelbetrag"],
  ],
  [
    {
      schuldenBei: "jugendamt",
    },
    ["/glaeubiger", "/pfaendung-unterhalt", "/sockelbetrag"],
  ],
  [
    {
      schuldenBei: "weissNicht",
    },
    ["/glaeubiger", "/glaeubiger-unbekannt", "/sockelbetrag"],
  ],
  [
    {
      schuldenBei: "staatsanwaltschaft",
    },
    ["/glaeubiger", "/pfaendung-strafe", "/sockelbetrag"],
  ],
  [
    {
      schuldenBei: "kasse",
    },
    ["/glaeubiger", "/pfaendung-strafe", "/sockelbetrag"],
  ],
  // sockelbetrag
  [
    {
      sockelbetrag: "nein",
    },
    ["/sockelbetrag", "/ergebnis/geringe-einkuenfte"],
  ],
  [
    {
      sockelbetrag: "ja",
    },
    ["/sockelbetrag", "/zwischenseite-unterhalt"],
  ],
  // Unterhalt
  [
    {},
    [
      "/zwischenseite-unterhalt",
      "/kinder",
      "/partner",
      "/zwischenseite-einkuenfte",
    ],
  ],
  [
    { hasKinder: "yes" },
    ["/kinder", "/kinder-wohnen-zusammen", "/kinder-unterhalt", "/partner"],
  ],
  [
    { verheiratet: "ja" },
    [
      "/partner",
      "/partner-wohnen-zusammen",
      "/partner-unterhalt",
      "/zwischenseite-einkuenfte",
    ],
  ],
  [
    { verheiratet: "getrennt" },
    ["/partner", "/partner-unterhalt", "/zwischenseite-einkuenfte"],
  ],
  // Cash
  [
    {},
    [
      "/zwischenseite-einkuenfte",
      "/arbeit",
      "/sozialleistungen",
      "/sozialleistungen-umstaende",
      "/ergebnis/naechste-schritte",
    ],
  ],
  [
    { hasArbeit: "yes" },
    [
      "/arbeit",
      "/arbeit-art",
      "/nachzahlung-arbeitgeber",
      "/einmalzahlung-arbeitgeber",
      "/sozialleistungen",
    ],
  ],
  [
    { hasArbeit: "yes", nachzahlungArbeitgeber: "yes" },
    [
      "/arbeit-art",
      "/nachzahlung-arbeitgeber",
      "/hoehe-nachzahlung-arbeitgeber",
      "/einmalzahlung-arbeitgeber",
      "/sozialleistungen",
    ],
  ],
  [
    { hasSozialleistungen: "nein" },
    [
      "/sozialleistungen",
      "/sozialleistungen-umstaende",
      "/ergebnis/naechste-schritte",
    ],
  ],
  [
    {
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        pflegegeld: CheckboxValue.on,
        kindergeld: CheckboxValue.off,
        wohngeld: CheckboxValue.off,
      },
    },
    [
      "/sozialleistungen",
      "/sozialleistungen-umstaende",
      "/pflegegeld",
      "/sozialleistung-nachzahlung",
      "/sozialleistungen-einmalzahlung",
      "/ergebnis/naechste-schritte",
    ],
  ],
  [
    {
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        pflegegeld: CheckboxValue.off,
        kindergeld: CheckboxValue.off,
        wohngeld: CheckboxValue.off,
      },
    },
    [
      "/sozialleistungen",
      "/sozialleistungen-umstaende",
      "/ergebnis/naechste-schritte",
    ],
  ],
  [
    {
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        pflegegeld: CheckboxValue.off,
        kindergeld: CheckboxValue.on,
        wohngeld: CheckboxValue.on,
      },
    },
    [
      "/sozialleistungen",
      "/sozialleistungen-umstaende",
      "/sozialleistung-nachzahlung",
      "/sozialleistungen-einmalzahlung",
      "/ergebnis/naechste-schritte",
    ],
  ],
  [
    {
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        pflegegeld: CheckboxValue.off,
        kindergeld: CheckboxValue.on,
        wohngeld: CheckboxValue.on,
      },
    },
    [
      "/sozialleistungen",
      "/sozialleistungen-umstaende",
      "/sozialleistung-nachzahlung",
      "/sozialleistungen-einmalzahlung",
      "/ergebnis/naechste-schritte",
    ],
  ],
  [
    {
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        pflegegeld: CheckboxValue.off,
        kindergeld: CheckboxValue.on,
        wohngeld: CheckboxValue.on,
      },
      hasSozialleistungNachzahlung: "no",
    },
    [
      "/sozialleistung-nachzahlung",
      "/sozialleistungen-einmalzahlung",
      "/ergebnis/naechste-schritte",
    ],
  ],
  [
    {
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        pflegegeld: CheckboxValue.off,
        kindergeld: CheckboxValue.on,
        wohngeld: CheckboxValue.on,
      },
      hasSozialleistungNachzahlung: "yes",
    },
    [
      "/sozialleistung-nachzahlung",
      "/hoehe-nachzahlung-sozialleistung",
      "/sozialleistungen-einmalzahlung",
      "/ergebnis/naechste-schritte",
    ],
  ],
  [
    {
      hasKontopfaendung: "ja",
      hasPKonto: "nichtEingerichtet",
      schuldenBei: "privat",
      pfaendungUnterhalt: "yes",
      sockelbetrag: "ja",
      hasKinder: "yes",
      kinderUnterhalt: "no",
      verheiratet: "nein",
      hasArbeit: "yes",
      nachzahlungArbeitgeber: "yes",
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        kindergeld: CheckboxValue.on,
        pflegegeld: CheckboxValue.off,
        wohngeld: CheckboxValue.off,
      },
      hasSozialleistungNachzahlung: "yes",
    },
    [
      "/start",
      "/kontopfaendung",
      "/p-konto",
      "/p-konto-probleme",
      "/glaeubiger",
      "/pfaendung-unterhalt",
      "/sockelbetrag",
      "/zwischenseite-unterhalt",
      "/kinder",
      "/kinder-wohnen-zusammen",
      "/kinder-unterhalt",
      "/partner",
      "/zwischenseite-einkuenfte",
      "/arbeit",
      "/arbeit-art",
      "/nachzahlung-arbeitgeber",
      "/hoehe-nachzahlung-arbeitgeber",
      "/einmalzahlung-arbeitgeber",
      "/sozialleistungen",
      "/sozialleistungen-umstaende",
      "/sozialleistung-nachzahlung",
      "/hoehe-nachzahlung-sozialleistung",
      "/sozialleistungen-einmalzahlung",
    ],
  ],
] as const satisfies TestCases<KontopfaendungWegweiserContext>;

export const testCasesKontopfaendungWegweiser = { machine, cases };
