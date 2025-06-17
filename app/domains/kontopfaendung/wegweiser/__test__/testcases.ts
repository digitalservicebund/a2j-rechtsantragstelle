import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "./testMachine";
import { type KontopfaendungWegweiserUserData } from "../userData";

const cases = [
  [{}, ["/start", "/kontopfaendung", "/ergebnis/keine-kontopfaendung"]],
  [
    { hasKontopfaendung: "nein" },
    ["/start", "/kontopfaendung", "/ergebnis/keine-kontopfaendung"],
  ],
  [
    { hasKontopfaendung: "ja", hasPKonto: "nichtAktiv" },
    [
      "/kontopfaendung",
      "/p-konto",
      "/p-konto-probleme",
      "/zwischenseite-unterhalt",
    ],
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
    { verheiratet: "ja", partnerWohnenZusammen: "no" },
    [
      "/partner",
      "/partner-wohnen-zusammen",
      "/partner-unterhalt",
      "/zwischenseite-einkuenfte",
    ],
  ],
  [
    { verheiratet: "ja", partnerWohnenZusammen: "yes" },
    ["/partner", "/partner-wohnen-zusammen", "/zwischenseite-einkuenfte"],
  ],
  [{ verheiratet: "nein" }, ["/partner", "/zwischenseite-einkuenfte"]],
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
        pflegegeld: "on",
        kindergeld: "off",
        wohngeld: "off",
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
        pflegegeld: "off",
        kindergeld: "off",
        wohngeld: "off",
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
        pflegegeld: "off",
        kindergeld: "on",
        wohngeld: "on",
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
        pflegegeld: "off",
        kindergeld: "on",
        wohngeld: "on",
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
        pflegegeld: "off",
        kindergeld: "on",
        wohngeld: "on",
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
        pflegegeld: "off",
        kindergeld: "on",
        wohngeld: "on",
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
      pfaendungUnterhalt: "yes",
      hasKinder: "yes",
      kinderUnterhalt: "no",
      verheiratet: "nein",
      hasArbeit: "yes",
      nachzahlungArbeitgeber: "yes",
      hasSozialleistungen: "nein",
      sozialleistungenUmstaende: {
        kindergeld: "on",
        pflegegeld: "off",
        wohngeld: "off",
      },
      hasSozialleistungNachzahlung: "yes",
    },
    [
      "/start",
      "/kontopfaendung",
      "/p-konto",
      "/p-konto-probleme",
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
] as const satisfies TestCases<KontopfaendungWegweiserUserData>;

export const testCasesKontopfaendungWegweiser = { machine, cases };
